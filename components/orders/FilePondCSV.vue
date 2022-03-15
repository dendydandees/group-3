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
import { Order, OrderItem } from '~/types/orders'
import { VuexModuleApplications } from '~/types/applications'

// Create component file pond
const FilePond = vueFilePond(
  FilePondPluginFileValidateType,
  FilePondPluginFileValidateSize,
  FilePondPluginFileEncode
)

export default defineComponent({
  components: {
    FilePond,
  },
  props: {
    value: {
      type: Array,
      required: true,
    },
  },
  setup(_props, { emit }) {
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

    const formatKey = (data: {}) => {
      const newObject = {} as any

      for (const [key, value] of Object.entries(data)) {
        let formatKey = key

        if (key.includes('*')) {
          formatKey = formatKey.replaceAll(/[*]/g, '')
        }

        if (key.includes('_')) {
          formatKey = formatKey.replace(/(_)./g, (s) =>
            s.slice(-1).toUpperCase()
          )
        }

        newObject[formatKey] = value
      }

      return newObject
    }
    const handleBeforeAddFile = () => {
      storeApplications.commit('applications/RESET_ALERT')
      emit('changeLoading')
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
          const worksheetOrders = workbook.Sheets.Orders
          const worksheetItems = workbook.Sheets['Order Items']
          // convert to json format
          let orders = utils.sheet_to_json(worksheetOrders) as Order[]
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

          // format keys orders data
          orders = orders.map((data) => {
            // format key orders data
            return formatKey(data)
          })

          // format keys order items data
          orderItems = orderItems.map((data) => {
            // format key orders data
            return formatKey(data)
          })

          // filter excel data notes
          orders = orders.filter((data) => !Object.keys(data).includes('note'))
          orderItems = orderItems.filter(
            (data) => typeof data.productCode !== 'string'
          )

          // merge orders and order items
          const batchOrders = orders.map((order) => {
            const items = orderItems
              .filter((item) => {
                return order.orderCode === item.orderCode
              })
              .map((order) => ({
                ...order,
                price: order.price.toString(),
                productCode: order.productCode.toString(),
              }))

            return {
              ...order,
              items,
              consigneePostal: order.consigneePostal.toString(),
              pickupPostal: order.pickupPostal.toString(),
            }
          })

          emit('input', batchOrders)
        }
      } catch (error) {
        return error
      } finally {
        emit('changeLoading')
      }
    }
    const handleRemoveFile = (_error: ErrorFilePond, _file: any) => {
      emit('input', [])
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
