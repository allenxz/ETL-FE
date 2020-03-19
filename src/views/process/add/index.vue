<template>
  <div class="process-add">
    <a-row class="toolbar-container">
      <a-col :span="24">
        <span class="tool">
          <a-tooltip placement="bottom">
            <template slot="title">
              添加结点
            </template>
            <a-icon type="plus" />
          </a-tooltip>
        </span>
        <span class="tool">
          <a-tooltip placement="bottom">
            <template slot="title">
              删除结点
            </template>
            <a-icon type="minus" />
          </a-tooltip>
        </span>
        <a-divider type="vertical" />
        <span class="tool">
          <a-tooltip placement="bottom">
            <template slot="title">
              复制结点
            </template>
            <a-icon type="copy" />
          </a-tooltip>
        </span>
        <span class="tool">
          <a-tooltip placement="bottom">
            <template slot="title">
              粘贴结点
            </template>
            <a-icon type="snippets" />
          </a-tooltip>
        </span>
        <a-divider type="vertical" />
        <span class="tool">
          <a-tooltip placement="bottom">
            <template slot="title">
              保存流程
            </template>
            <a-icon type="save" />
          </a-tooltip>
        </span>
        <span class="tool">
          <a-tooltip placement="bottom">
            <template slot="title">
              清空画布
            </template>
            <a-icon type="delete" />
          </a-tooltip>
        </span>
        <a-divider type="vertical" />
        <span class="tool">
          <a-tooltip placement="bottom">
            <template slot="title">
              结点左移
            </template>
            <a-icon type="arrow-left" />
          </a-tooltip>
        </span>
        <span class="tool">
          <a-tooltip placement="bottom">
            <template slot="title">
              结点右移
            </template>
            <a-icon type="arrow-right" />
          </a-tooltip>
        </span>
        <a-divider type="vertical" />
        <span class="tool">
          <a-tooltip placement="bottom">
            <template slot="title">
              多选
            </template>
            <a-icon type="appstore" />
          </a-tooltip>
        </span>

      </a-col>
    </a-row>
    <a-row class="editer">
      <a-col :span="18" class="canvas">col-12</a-col>
      <a-col :span="6" class="config">col-12</a-col>
    </a-row>
  </div>
</template>

<script>
import './style.scss'
export default {

}
</script>
