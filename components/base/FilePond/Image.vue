<template>
  <div>
    <FilePond
      v-bind="pondSettings"
      ref="pond"
      v-model="logo"
      name="logo"
      @addfile="handleAddFile"
      @addfilestart="handleBeforeAddFile"
      @removefile="handleRemoveFile"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, Ref } from '@nuxtjs/composition-api'

// Import Vue FilePond
import vueFilePond from 'vue-filepond'
import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'
import 'filepond-plugin-image-edit/dist/filepond-plugin-image-edit.css'
// eslint-disable-next-line import/default
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
// eslint-disable-next-line import/default
import FilePondPluginImageCrop from 'filepond-plugin-image-crop'
// eslint-disable-next-line import/default
import FilePondPluginImageResize from 'filepond-plugin-image-resize'
// eslint-disable-next-line import/default
import FilePondPluginImageTransform from 'filepond-plugin-image-transform'
// eslint-disable-next-line import/default
import FilePondPluginImageEdit from 'filepond-plugin-image-edit'
// eslint-disable-next-line import/default
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type'
// eslint-disable-next-line import/default
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
// eslint-disable-next-line import/default
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size'
// eslint-disable-next-line import/default
import FilePondPluginFileEncode from 'filepond-plugin-file-encode'

// Create component file pond
const FilePond = vueFilePond(
  FilePondPluginImageEdit,
  FilePondPluginFileValidateType,
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginImageCrop,
  FilePondPluginImageResize,
  FilePondPluginImageTransform,
  FilePondPluginFileValidateSize,
  FilePondPluginFileEncode
)

export interface ErrorFilePond {
  main: string
  sub: string
}

export default defineComponent({
  name: 'FilePondImage',
  components: {
    FilePond,
  },
  props: {
    value: {
      type: String as PropType<string>,
      default: '',
      required: true,
    },
  },
  setup(_props, { emit }) {
    const logo = ref([])
    const pond = ref({}) as Ref<any>
    const pondSettings = ref({
      // Size validation
      allowFileSizeValidation: true,
      maxFileSize: '500KB',
      labelMaxFileSizeExceeded: 'Partner profile logo file is too large',
      // Type validation
      allowFileTypeValidation: true,
      labelFileTypeNotAllowed: 'Partner profile logo file is invalid type',
      acceptedFileTypes: ['image/png', 'image/jpeg'],
      // Image crop
      allowImageCrop: true,
      imageCropAspectRatio: '1:1',
      // Image preview
      allowImagePreview: true,
      imagePreviewHeight: 120,
      // Image Resize
      allowImageResize: true,
      imageResizeTargetWidth: 120,
      imageResizeTargetHeight: 120,
      // Imgae ransform
      allowImageTransform: true,
      // Image Edit
      allowImageEdit: true,
      imageEditAllowEdit: true,
      styleImageEditButtonEditItemPosition: 'left bottom',
      // Image Exif
      allowImageExifOrientation: true,
      // Image encode
      allowFileEncode: true,
      // Pond settings
      labelIdle: `Drag & Drop in here or
                <span class="filepond--label-action font-weight-medium">Browse</span>`,
      stylePanelLayout: 'compact circle',
      styleLoadIndicatorPosition: 'center bottom',
      styleButtonRemoveItemPosition: 'center bottom',
      dropOnPage: true,
      allowMultiple: false,
      checkValidity: true,
    })

    const handleBeforeAddFile = () => {
      emit('changeError', {
        main: '',
        sub: '',
      })
      emit('changeLoading')
    }
    const handleAddFile = (error: ErrorFilePond, file: any) => {
      try {
        if (error) {
          emit('changeError', error)
          return pond.value.removeFiles()
        }

        const fileBase64 = file.getFileEncodeBase64String()

        emit('input', fileBase64)
      } catch (error) {
        return error
      } finally {
        emit('changeLoading')
      }
    }
    const handleRemoveFile = (_error: ErrorFilePond, _file: any) => {
      emit('input', '')
    }

    return {
      logo,
      pond,
      pondSettings,
      handleBeforeAddFile,
      handleAddFile,
      handleRemoveFile,
    }
  },
})
</script>
