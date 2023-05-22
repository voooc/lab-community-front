<template>
    <div class="wrapper">
        <div class="edit-message-wrapper">
            <div
                class="edit-dialog-wrapper"
                v-click-outside="hideActionPanel"
                :class="{ active: data.isTextareaFocus }"
                :style="{
                    backgroundColor: !data.isTextareaFocus ? 'rgba(226,230,235,.2)' : '#fff',
                }"
            >
                <div
                    class="edit-dialog"
                    id="textAreaDiv"
                    :style="{ minHeight: editBoxMinHeight }"
                    ref="textArea"
                    :class="{ empty: data.isEmpty }"
                    @focus="editFocus"
                    @blur="editBlur"
                    @input="handleInput"
                    @propertychange="handleInput"
                    contentEditable="true"
                    spellcheck="false"
                    :placeholder="placeholder"
                >
                </div>
                <message-image-uploader
                    ref="imageUploader"
                    :maxImageNum="maxImageNum"
                    @can-add="handleCanAddImage"
                    @change="handleImageFileListChange"
                    :input-id="inputId"
                />
                <span class="max-limit" :class="{ exceeded: isInputExceeded }">{{
                    maxWordLimit - data.currentWordLength
                }}</span>
            </div>
            <div class="edit-bottom" v-show="showActionPanel">
                <div class="left">
                    <a-popover
                        trigger="click"
                        style="width: 280px"
                        placement="bottom"
                        overlayClassName="emoji-selector"
                    >
                        <template #content>
                            <emotion-select @choose="handleEmotionChoose" />
                        </template>
                        <div ref="box" class="box">
                            <smile-outlined />
                            <span>表情</span>
                        </div>
                    </a-popover>
                    <label
                        :for="inputId"
                        class="box"
                        @click="handleImageUpload"
                        :class="{ 'disabled-add': !data.canAddImage }"
                        style="margin-left: 10px"
                    >
                        <file-image-outlined />
                        <span>图片</span>
                    </label>
                </div>
                <div class="right">
                    <span class="tip">Ctrl or ⌘ + Enter</span>
                    <a-button
                        size="small"
                        :disabled="isSubmitBtnDisabled"
                        @click="submit"
                        type="primary"
                    >
                        {{ isSubmitting ? buttonTextInSubmitting : submitButtonText }}
                    </a-button>
                </div>
            </div>
            <div class="overlay-loading" v-if="isSubmitting"> </div>
        </div>
    </div>
</template>
<script lang="ts">
    import { ref, reactive, nextTick, computed, defineComponent } from 'vue';
    import MessageImageUploader from './MessageImageUploader.vue';
    import EmotionSelect from './EmotionSelect.vue';
    import { SmileOutlined, FileImageOutlined } from '@ant-design/icons-vue';
    import clickOutside from '@/directives/clickOutside';
    export default defineComponent({
        name: 'MessageEditBox',
        components: { MessageImageUploader, SmileOutlined, FileImageOutlined, EmotionSelect },
        directives: {
            clickOutside,
        },
        props: {
            placeholder: {
                type: String,
                default: '请输入',
            },
            editBoxMinHeight: {
                type: String,
                default: '75px',
            },
            maxImageNum: {
                type: Number,
                required: true,
            },
            inputId: {
                type: String,
                required: true,
            },
            maxWordLimit: {
                type: Number,
                default: 500,
            },
            submitButtonText: {
                type: String,
                default: '发布',
            },
            //输入框失去焦点时是否隐藏操作栏
            hideAction: {
                type: Boolean,
                default: false,
            },
            isSubmitting: {
                type: Boolean,
                default: false,
            },
            buttonTextInSubmitting: {
                type: String,
                default: '提交中',
            },
        },
        emits: ['submit'],
        setup(props, { emit, expose }) {
            const textArea = ref();
            const imageUploader = ref();
            const data = reactive({
                textAreaContent: '',
                isShowActionPanel: false,
                isTextareaFocus: false,
                isEmpty: true,
                canAddImage: true,
                imageListToUpload: [],
                hackReset: true,
                currentWordLength: 0,
            });
            function handleCanAddImage(can: boolean) {
                data.canAddImage = can;
            }
            function hideActionPanel() {
                data.isShowActionPanel = false;
            }
            function editFocus() {
                data.isShowActionPanel = true;
                data.isTextareaFocus = true;
            }
            let sel: null | Selection = null;
            let range: null | Range = null;
            function editBlur() {
                data.isTextareaFocus = false;
                sel = window.getSelection() as Selection;
                range = sel.getRangeAt(0);
            }
            function handleInput() {
                const innerHtml = textArea.value.innerHTML;
                //正则匹配表情字符串，只算一个字符,注意是非贪婪全局匹配(?)
                const emotionRegExp = /\[:.+?\]/g;
                data.currentWordLength = innerHtml.replace(emotionRegExp, '_').length;
                data.textAreaContent = innerHtml;
                innerHtml === '' ? (data.isEmpty = true) : (data.isEmpty = false);
            }
            const showActionPanel = computed(() => {
                return props.hideAction ? data.isShowActionPanel : true;
            });
            function resetAfterSubmit() {
                data.hackReset = false;
                data.currentWordLength = 0;
                data.textAreaContent = '';
                data.canAddImage = true;
                data.imageListToUpload = [];
                data.isEmpty = true;
                textArea.value.innerHTML = '';
                imageUploader.value.resetAfterSubmit();
                nextTick(() => {
                    data.hackReset = true;
                });
            }
            function focusInput() {
                textArea.value.focus();
                data.isTextareaFocus = true;
            }
            expose({ resetAfterSubmit, focusInput });
            function handleImageFileListChange(list) {
                data.imageListToUpload = list;
            }
            //处理点击图片按钮
            function handleImageUpload(e) {
                //如果不能继续添加图片则阻止默认事件-打开文件选择框
                if (!data.canAddImage) {
                    e.preventDefault();
                }
            }
            const isInputExceeded = computed(() => {
                return props.maxWordLimit - data.currentWordLength < 0;
            });
            const isSubmitBtnDisabled = computed(() => {
                //这里需要对表情进行处理
                const emotionRegExp = /\[:.+?\]/g;
                const length = data.textAreaContent.replace(emotionRegExp, '_').length;
                return !(length > 0 && length <= props.maxWordLimit);
            });
            function submit() {
                emit('submit', data.imageListToUpload, data.textAreaContent);
            }
            function handleEmotionChoose(emotionName) {
                // 输入框获得焦点,然后插入表情
                textArea.value.focus();
                pasteHtmlAtCaret(emotionName);
                // 更新字符数
                handleInput();
            }
            //在光标指定位置插入内容
            function pasteHtmlAtCaret(content) {
                if (!content) {
                    //如果插入的内容为空则返回
                    return;
                }
                if (!sel) {
                    sel = window.getSelection() as Selection;
                    range = sel.getRangeAt(0);
                }

                if (sel.rangeCount > 0 && range) {
                    let el = document.createElement('div'); //创建一个空的div外壳
                    el.innerHTML = content; //设置div内容为我们想要插入的内容。
                    let frag = document.createDocumentFragment(); //创建一个空白的文档片段，便于之后插入dom树

                    let node = el.firstChild as Node;
                    let lastNode = frag.appendChild(node);
                    range.insertNode(frag); //设置选择范围的内容为插入的内容
                    let contentRange = range.cloneRange(); //克隆选区
                    contentRange.setStartAfter(lastNode); //设置光标位置为插入内容的末尾
                    contentRange.collapse(true); //移动光标位置到末尾
                    sel.removeAllRanges(); //移出所有选区
                    sel.addRange(contentRange); //添加修改后的选区
                }
            }
            return {
                handleEmotionChoose,
                submit,
                isSubmitBtnDisabled,
                isInputExceeded,
                handleImageUpload,
                handleImageFileListChange,
                showActionPanel,
                handleCanAddImage,
                editBlur,
                editFocus,
                hideActionPanel,
                data,
                handleInput,
                textArea,
                imageUploader,
            };
        },
    });
</script>
<style scoped lang="less">
    .wrapper {
        width: 100%;
        padding-bottom: 0;

        .edit-message-wrapper {
            box-sizing: border-box;
            background-color: #fff;
            position: relative;

            .overlay-loading {
                position: absolute;
                left: 0;
                top: 0;
                right: 0;
                bottom: 0;
            }

            .active {
                border: 1px solid #007fff !important;
            }

            .edit-dialog-wrapper {
                border: 1px solid hsla(0, 0%, 59%, 0.2);
                position: relative;
                background-color: rgba(226, 230, 235, 0.2);
                border-radius: 3px;

                .max-limit {
                    position: absolute;
                    right: 5px;
                    bottom: 5px;
                    font-size: 13px;
                    z-index: 1;
                    user-select: none;
                    pointer-events: none;
                    color: #a1a9b3;
                }

                .exceeded {
                    color: #ff0000;
                }

                .edit-dialog.empty:after {
                    display: inline-block;
                }

                .edit-dialog {
                    position: relative;
                    min-height: 75px;
                    padding: 8px 10px;
                    outline: none;
                    color: #17181a;
                    height: 100%;
                    font-size: 14px;
                    /*防止复制粘贴出现富文本*/
                    -webkit-user-modify: read-write-plaintext-only;
                    word-break: break-all;
                    /*用伪元素模拟placeholder*/
                    &:after {
                        content: attr(placeholder);
                        position: absolute;
                        top: 8px;
                        color: rgba(23, 24, 26, 0.4);
                        pointer-events: none;
                        -webkit-user-select: none;
                        -moz-user-select: none;
                        -ms-user-select: none;
                        user-select: none;
                        display: none;
                    }
                }
            }

            .edit-bottom {
                display: flex;
                margin-top: 10px;
                justify-content: space-between;

                .right {
                    display: flex;
                    align-items: center;

                    .tip {
                        color: #c2c2c2;
                        text-align: center;
                        font-size: 13px;
                        /*防止用户选取到该文本*/
                        user-select: none;
                        margin-right: 10px;
                    }
                }

                .left {
                    display: flex;
                    align-items: center;

                    .box {
                        color: #027fff;
                        cursor: pointer;
                        font-size: 14px;
                        outline: none;
                        border: none;
                        background-color: #fff;
                    }

                    .disabled-add {
                        color: #cbcbcb;
                        cursor: not-allowed;
                    }
                }
            }
        }
    }
</style>
<style lang="less">
    .emoji {
        vertical-align: sub;
        font-size: 1.1em;
        width: 1.1em;
        height: 1.1em;
    }

    .edit-message-wrapper .el-loading-spinner .el-loading-text {
        color: #fff !important;
    }

    .edit-message-wrapper .el-loading-spinner .path {
        stroke: #fff !important;
    }
</style>
