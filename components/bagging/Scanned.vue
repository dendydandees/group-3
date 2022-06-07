<template>
  <article class="scanned-tab pa-8">
    <!-- <v-card
      class="mx-auto"
    >
      <v-container fluid class="px-0">
        <v-row>
          <v-col
            v-for="(partner, u) in 4"
            :key="u"
            cols="4"
            class="d-flex align-center justify-space-between pa-4"
          >
            <v-card
              elevation="1"
              shaped
              tile
              class="rounded-xl d-flex flex-column  pa-4 align-center"
              width="100%"
              height="300px"
              color="white"
            >
              <v-btn
                color="green darken-1 white--text"
              >
                CLOSE BAG
              </v-btn>
              <div>
                SINGAPORE - 1
              </div>
              <div>
                Orders: 10
              </div>
              <v-divider width="100%"/>
              <v-virtual-scroll
                :items="[1, 2, 3, 4, 5]"
                height="200"
                item-height="64"
              >
                <template #default="{ item }">
                  <v-list-item :key="item">
                    <v-list-item-action>
                      <v-btn
                        fab
                        small
                        depressed
                        color="primary"
                      >
                        1
                      </v-btn>
                    </v-list-item-action>

                    <v-list-item-content>
                      <v-list-item-title>
                        User Database Record <strong>ID 1</strong>
                      </v-list-item-title>
                    </v-list-item-content>

                    <v-list-item-action>
                      <v-icon small>
                        mdi-open-in-new
                      </v-icon>
                    </v-list-item-action>
                  </v-list-item>

                  <v-divider></v-divider>
                </template>
              </v-virtual-scroll>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-card> -->
    <v-container fluid class="pa-0">
      <v-row>
        <v-col
          v-for="(partner, u) in 4"
          :key="u"
          cols="4"
          class="d-flex align-center justify-space-between pa-4"
        >
          <v-card
            elevation="1"
            class="mx-auto"
            width="100%"
            :style="'overflow: hidden'"
          >
            <v-card-title class=" d-flex justify-center align-center text-center mb-3">
              <v-btn
                color="green darken-1 white--text mb-4"
                @click="toggleConfirm"
              >
                CLOSE BAG
              </v-btn>
              <div class="text-h4 mb-2">
                SINGAPORE - 1
              </div>
              <div class="title">
                Orders: 10
              </div>
            </v-card-title>

            <v-divider></v-divider>

            <v-virtual-scroll
              :items="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
              :item-height="50"
              height="200"
            >
              <template #default="{ item }">
                <v-list-item
                  class="custom-list-item-scroll"
                >
                  <v-list-item-avatar>
                    <v-icon
                    >
                      mdi-email-outline
                    </v-icon>
                  </v-list-item-avatar>

                  <v-list-item-content>
                    <v-list-item-title>
                      tessss
                    </v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </template>
            </v-virtual-scroll>
          </v-card>
        </v-col>
      </v-row>
    </v-container>


    <!-- Modal confirm -->
    <BaggingModalConfirm
      v-model="dialog.confirm"
      :dialog-settings="dialogSettings"
      :is-confirm="true"
      @doSubmit="submit"
      @doCancel="handleCancel"
    />
    <!-- Modal after click no -->
    <BaggingModalConfirm
      v-model="dialog.cancel"
      :dialog-settings="dialogSettings"
      @doSubmit="submit({isCancel: true})"
    />

  </article>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  ref,
  Ref,
  useStore,
  useRouter,
  onMounted,
  watch,
  PropType,
} from '@nuxtjs/composition-api'
import { ModalConfirm, VuexModuleApplications } from '~/types/applications'

export default defineComponent({
  name: 'BaggingScanned',
  components: {
  },
  props: {
  },
  setup(props) {
    const storeApplications = useStore<VuexModuleApplications>()
    const dialog = ref({
      confirm: false,
      cancel: false
    })
    const dialogSettings = ref({
      loading: false,
      title: '',
      content: '',
      cancelText: '',
      submitText: '',
      submitColor: '',
    }) as Ref<ModalConfirm>
    const dataTemp = [
      {
        name: 'Malaysia',
        port: 'KUL',
        total_orders: 15,
        sub: [
          {
            name: 'Malaysia - 1',
            total_orders: 10,
            orders: [
              {
                orderCode: 'TES1321'
              }
            ]
          },
          {
            name: 'Malaysia - 2',
            total_orders: 5,
            orders: [
              {
                orderCode: 'TES123'
              },
              {
                orderCode: 'TES321'
              },
              {
                orderCode: 'TES456'
              }
            ]
          }
        ]
      },
      {
        name: 'Singapore',
        port: 'SIN',
        total_orders: 15,
        sub: [
          {
            name: 'Singapore - 1',
            total_orders: 10,
            orders: [
              {
                orderCode: 'SIN1321'
              }
            ]
          },
          {
            name: 'Singapore - 2',
            total_orders: 5,
            orders: [
              {
                orderCode: 'SIN123'
              },
              {
                orderCode: 'SIN321'
              },
              {
                orderCode: 'SIN456'
              }
            ]
          }
        ]
      }
    ]
    function toggleConfirm() {
      dialogSettings.value = {
        loading: false,
        title: 'Print label now ?',
        content: '',
        cancelText: 'No',
        submitText: 'Yes',
        submitColor: 'primary',
      }
      dialog.value.confirm = true
    }
    async function submit(params: {isCancel?: boolean}) {
      try {
        dialogSettings.value.loading = true

        storeApplications.commit('applications/SET_ALERT', {
          isShow: true,
          type: 'success',
          message: 'Print label successfully!',
        })
      } catch (error) {

        storeApplications.commit('applications/SET_ALERT', {
          isShow: true,
          type: 'error',
          message: `Print label ${'error'}`,
        })
      } finally {
        dialogSettings.value.loading = false
        if(params?.isCancel) {
          dialog.value.cancel = false
        } else {
          dialog.value.confirm = false
        }
        setTimeout(() => {
          storeApplications.commit('applications/RESET_ALERT')
        }, 3000)
      }
    }
    function handleCancel() {
      dialogSettings.value = {
        loading: false,
        title: 'Make sure bags are arranged properly to prevent mix-up',
        content: '',
        cancelText: '',
        submitText: 'Ok',
        submitColor: 'primary',
      }
      dialog.value.cancel = true

    }
    return {
      dataTemp,
      dialog,
      dialogSettings,
      toggleConfirm,
      submit,
      handleCancel
    }
  },
})
</script>

<style lang="scss">
@import '~/assets/scss/color.module.scss';
.scanned-tab {
  .custom-list-item-scroll {
    &:hover {
      background: $primary;
      color: white !important;
      .v-icon {
        color: white !important;
      }
    }
  }
}
</style>
