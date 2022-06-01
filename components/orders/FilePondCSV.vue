<template>
  <FilePond
    v-bind="pondSettings"
    ref="pondOrders"
    v-model="file"
    name="orders"
    class="ordersPondCSV"
    @addfile="handleAddFile"
    @addfilestart="handleBeforeAddFile"
    @removefile="handleRemoveFile"
  />
</template>

<script lang="ts">
import { defineComponent, ref, Ref, useStore } from '@nuxtjs/composition-api'
import { read, utils } from 'xlsx'

// Import Vue FilePond
import vueFilePond from 'vue-filepond'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import 'filepond-plugin-image-edit/dist/filepond-plugin-image-edit.css'

// eslint-disable-next-line import/default
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
// eslint-disable-next-line import/default
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
// eslint-disable-next-line import/default
import FilePondPluginFileEncode from 'filepond-plugin-file-encode'

// Interfaces and types
import { ErrorFilePond } from '../base/FilePond/Image.vue'
import { OrderCrossBorder, OrderDomestic, OrderItem } from '~/types/orders'
import { VuexModuleApplications } from '~/types/applications'

// Create component file pond
const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize,
  FilePondPluginFileEncode
)

type Orders = OrderCrossBorder | OrderDomestic

export default defineComponent({
  components: {
    FilePond,
  },
  props: {
    value: {
      type: Array,
      required: true,
    },
    step: {
      type: Number,
      required: true,
    },
  },
  setup(props, { emit }) {
    // store manage
    const storeApplications = useStore<VuexModuleApplications>()

    const file = ref([])
    const pond = ref({}) as Ref<any>
    const pondSettings = ref({
      // Size validation
      allowFileSizeValidation: true,
      maxFileSize: '5MB',
      labelMaxFileSizeExceeded: 'Order file is too large',
      // Type validation
      allowFileTypeValidation: true,
      labelFileTypeNotAllowed: 'Order file is invalid type',
      acceptedFileTypes: [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      ],
      // Pond settings
      labelIdle: `
        <span>Drag and drop to upload or</span>
        </br>
        </br>
        <span class="filepond--label-action font-weight-medium secondary--text text-decoration-none">Browse</span>
      `,
      dropOnPage: true,
      allowMultiple: false,
      checkValidity: true,
    })
    const errorMessages = ref([]) as Ref<string[]>

    const handleBeforeAddFile = () => {
      errorMessages.value = []
      storeApplications.commit('applications/RESET_ALERT')
      emit('changeLoading')
    }
    const handleRemoveFile = (_error: ErrorFilePond, _file: any) => {
      errorMessages.value = []
      storeApplications.commit('applications/RESET_ALERT')
      emit('input', [])
    }
    const handleAddFile = (error: ErrorFilePond, { file }: { file: File }) => {
      try {
        // error on size and type validation
        if (error) {
          storeApplications.commit('applications/SET_ALERT', {
            isShow: true,
            type: 'error',
            message: `${error.main}, ${error.sub}!`,
          })
          return pond.value.removeFiles()
        }

        const reader = new FileReader()

        reader.readAsArrayBuffer(file)
        reader.onload = function () {
          const arrayBuffer = reader.result as ArrayBuffer
          const data = new Uint8Array(arrayBuffer)
          const workbook = read(data, { type: 'array' })
          // find the name of your sheet in the workbook first
          const worksheetOrders =
            workbook.Sheets[
              props.step === 0 ? 'Domestic Orders' : 'Crossborder Orders'
            ]
          const worksheetItems = workbook.Sheets['Order Items']
          // convert to json format
          let orders = utils.sheet_to_json(worksheetOrders) as Orders[]
          let orderItems = utils.sheet_to_json(worksheetItems) as OrderItem[]

          // error if file upload not same with example file
          if (orders.length === 0) {
            emit('input', [])

            return storeApplications.commit('applications/SET_ALERT', {
              isShow: true,
              type: 'error',
              message: `Order upload data invalid, The data contained in the file you uploaded is incorrect. Please add data according to the existing sample file!`,
            })
          }
          // format keys data
          const formatKey = (data: {}) => {
            const newObject = {} as any

            for (const [key, value] of Object.entries(data)) {
              let formatKey = key.toLowerCase()

              if (key.includes('*')) {
                formatKey = formatKey.replaceAll(/[*]/g, '')
              }

              if (key.includes('-')) {
                formatKey = formatKey.replaceAll(/[-]/g, ' ')
              }

              if (key.match(/\s/g)) {
                formatKey = formatKey.replace(/\s./g, (s) =>
                  s.slice(-1).toUpperCase()
                )
              }

              newObject[formatKey] = value
            }

            return newObject
          }
          // formatting service type data
          const formatServiceType = (data: boolean | string): boolean => {
            if (!data) return false

            return typeof data === 'boolean'
              ? data
              : data.toLowerCase() === 'yes'
          }
          // formatting duplicate order codes
          const checkDuplicateOrderCodes = (
            data: Orders[],
            func: (duplicate: boolean, o: Orders[]) => Orders[] | void
          ) => {
            const temp: Record<string, any> = {}

            data.forEach((item) => {
              temp[item.orderCode] =
                typeof temp[item.orderCode] === 'undefined'
                  ? 1
                  : temp[item.orderCode] + 1
            })
            const duplicateKeys = Object.keys(temp).filter(
              (key) => temp[key] > 1
            )

            return duplicateKeys.length > 0
              ? func(
                  true,
                  (data as []).filter(
                    (item: { orderCode: string }) =>
                      duplicateKeys.lastIndexOf(item.orderCode) !== -1
                  )
                )
              : func(false, data)
          }
          const messageDuplicateOrderCodes = (o: Orders[]) => {
            let message = 'Order code '

            for (const [i, k] of o.entries()) {
              if (i === 0) {
                message += k.orderCode
                continue
              }
              message += ', ' + k.orderCode
            }

            return (message += ' is duplicate!')
          }
          // show error messages
          const checkError = (order: Orders, items: OrderItem[]) => {
            if (!order.orderCode) {
              errorMessages.value.push(`Order code cannot be empty!`)

              return
            }

            if (items.length === 0) {
              errorMessages.value.push(
                `Order items on ${order.orderCode} is empty!`
              )
            }

            const isRequired = (
              key: string,
              data: any,
              onOrderItems = false
            ) => {
              if (!(data as any)[key]) {
                errorMessages.value.push(
                  `${key.charAt(0).toUpperCase() + key.slice(1)} ${
                    onOrderItems ? 'order item' : ''
                  } on ${order.orderCode}  is required!`
                )
              }
            }
            const isNotNumber = (
              key: string,
              data: any,
              onOrderItems = false
            ) => {
              if (typeof (data as any)[key] === 'string') {
                errorMessages.value.push(
                  `${key.charAt(0).toUpperCase() + key.slice(1)} ${
                    onOrderItems ? 'order item' : ''
                  } on ${order.orderCode} must be number!`
                )
              }
            }

            const cellMustBeNumber = ['width', 'height', 'weight', 'length']
            const cellMustBeRequired = [
              'consigneeName',
              'consigneeNumber',
              'consigneeEmail',
              'consigneeAddress',
              'consigneePostal',
              'consigneeCity',
              'consigneeProvince',
              'destinationPort',
              'length',
              'width',
              'height',
              'weight',
              'paymentType',
              'shipmentIncoterm',
              'senderCountry',
              'senderCity',
            ]
            const orderItemsRequired = [
              'description',
              'quantity',
              'category',
              'price',
              'currency',
            ]
            const orderItemsNumber = ['quantity', 'price']

            // check is number
            cellMustBeNumber.forEach((item) => isNotNumber(item, order))
            // check is required
            cellMustBeRequired.forEach((item) => isRequired(item, order))

            items.forEach((item) => {
              // check order item is number
              orderItemsNumber.forEach((key) => isNotNumber(key, item, true))
              // check order item is required
              orderItemsRequired.forEach((key) => isRequired(key, item, true))
            })
          }
          orders = checkDuplicateOrderCodes(
            orders
              .map((data) => formatKey(data))
              .filter((data) => !Object.keys(data).includes('note')),
            (isDuplicate, o) =>
              isDuplicate
                ? (emit('input', []),
                  storeApplications.commit('applications/SET_ALERT', {
                    isShow: true,
                    type: 'error',
                    message: messageDuplicateOrderCodes(o),
                  }))
                : o
          ) as Orders[]
          orderItems = orderItems
            .map((data) => formatKey(data))
            .filter((data) => typeof data.productCode !== 'string')

          // merge orders and order items
          const batchOrders = orders.map((order) => {
            const items = orderItems
              .filter((item) => order.orderCode === item.orderCode)
              .map((order) => ({
                ...order,
                productCode: order?.productCode?.toString() || '',
                quantity: parseFloat(order.quantity as unknown as string) || 0,
                price: parseFloat(order.price as unknown as string) || 0,
              })) as OrderItem[]
            // format cod value and currency
            const isCOD = order?.paymentType === 'cod'
            const codValue = isCOD
              ? parseFloat(order.codValue as unknown as string) || 0
              : 0
            const codCurrency = isCOD ? order.codCurrency : ''
            // format return
            let data: Orders = {
              ...order,
              items,
              codValue,
              codCurrency,
              length: parseFloat(order.length as unknown as string) || 0,
              width: parseFloat(order.width as unknown as string) || 0,
              height: parseFloat(order.height as unknown as string) || 0,
              weight: parseFloat(order.weight as unknown as string) || 0,
              consigneePostal: order?.consigneePostal?.toString() ?? '',
              consigneeNumber: order?.consigneeNumber?.toString() ?? '',
              consigneeTaxId: order?.consigneeTaxId?.toString() ?? '',
              consigneeState: order?.consigneeDistrict ?? '',
              senderPostal: order?.senderPostal?.toString() ?? '',
              senderContactNumber: order?.senderContactNumber?.toString() ?? '',
              senderState: order?.senderDistrict ?? '',
            }

            // for domestic
            if (props.step === 0) {
              const itemDomestic = order as OrderDomestic

              data = {
                ...data,
                pickup: formatServiceType(itemDomestic.pickup) || false,
              }
            }

            // for cross border
            if (props.step === 1) {
              const itemCrossBorder = order as OrderCrossBorder

              data = {
                ...data,
                firstMile:
                  formatServiceType(itemCrossBorder.firstMile) || false,
                lastMile: formatServiceType(itemCrossBorder.lastMile) || false,
                freightForwarder:
                  formatServiceType(itemCrossBorder.freightForwarder) || false,
                customs:
                  formatServiceType(itemCrossBorder.customBrokerages) || false,
                incoterm: itemCrossBorder?.shipmentIncoterm ?? '',
                lmPartnerCode: itemCrossBorder?.lmLControlBypass ?? '',
              }
            }

            // format error message
            checkError(order, items)

            return data
          })

          if (errorMessages.value.length !== 0) {
            storeApplications.commit('applications/SET_ALERT', {
              isShow: true,
              type: 'error',
              message: errorMessages.value,
            })
          }

          emit('input', batchOrders)
        }
      } catch (error) {
        return error
      } finally {
        setTimeout(() => {
          emit('changeLoading')
        }, 1000)
      }
    }

    return {
      file,
      pond,
      pondSettings,
      handleBeforeAddFile,
      handleAddFile,
      handleRemoveFile,
    }
  },
})
</script>
