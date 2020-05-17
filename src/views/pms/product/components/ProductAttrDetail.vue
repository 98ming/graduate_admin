<template>
  <div style="margin-top: 50px">
    <el-form :model="value" ref="productAttrForm" label-width="120px" style="width: 720px" size="small">
      <el-form-item label="属性类型：">
        <el-select v-model="value.productAttributeCategoryId"
                   placeholder="请选择属性类型"
                   @change="handleProductAttrChange">
          <el-option
            v-for="item in productAttributeCategoryOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="商品规格：">
        <el-card shadow="never" class="cardBg">
          <div v-for="(productAttr,idx) in selectProductAttr">
            {{productAttr.name}}：
            <div>
              <el-checkbox-group v-model="selectProductAttr[idx].values">
                <el-checkbox v-for="item in productAttr.attrList" :label="item" :key="item"
                             class="littleMarginLeft"></el-checkbox>
              </el-checkbox-group>
              <!--<el-checkbox v-for="item in productAttr.attrList" :label="item" :key="item" @change="handleCheckbox(idx,item)"></el-checkbox>-->
            </div>
          </div>
        </el-card>
        <el-table style="width: 100%;margin-top: 20px"
                  :data="value.skuStockList"
                  border>
          <el-table-column
            v-for="(item,index) in selectProductAttr"
            :label="item.name"
            :key="item.id"
            align="center">
            <template slot-scope="scope">
              {{getProductSkuSp(scope.row,index)}}
            </template>
          </el-table-column>
          <el-table-column
            label="销售价格"
            width="100"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.price"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="商品库存"
            width="80"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.stock"></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="SKU编号"
            align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.skuCode" disabled></el-input>
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            width="80"
            align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleRemoveProductSku(scope.$index, scope.row)">删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          style="margin-top: 20px"
          @click="handleRefreshProductSkuList">刷新列表
        </el-button>
        <el-button
          type="primary"
          style="margin-top: 20px"
          @click="handleSyncProductSkuPrice">同步价格
        </el-button>
        <el-button
          type="primary"
          style="margin-top: 20px"
          @click="handleSyncProductSkuStock">同步库存
        </el-button>
      </el-form-item>
      <el-form-item label="属性图片：" v-if="hasAttrPic">
        <el-card shadow="never" class="cardBg">
          <div v-for="(item,index) in this.value.skuStockList">
            <span>{{item.spData | myFilter}}:</span>
            <single-upload :value="item.pic"
                           style="width: 300px;display: inline-block;margin-left: 10px"></single-upload>
          </div>
        </el-card>
      </el-form-item>
      <el-form-item label="商品相册：">
        <multi-upload v-model="selectProductPics"></multi-upload>
      </el-form-item>
      <el-form-item label="规格参数：">
        <el-tabs v-model="activeHtmlName" type="card">
          <el-tab-pane label="电脑端详情" name="pc">
            <tinymce :width="595" :height="300" v-model="value.detailHtml"></tinymce>
          </el-tab-pane>
          <el-tab-pane label="移动端详情" name="mobile">
            <tinymce :width="595" :height="300" v-model="value.detailMobileHtml"></tinymce>
          </el-tab-pane>
        </el-tabs>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">上一步，填写商品促销</el-button>
        <el-button type="primary" size="medium" @click="handleFinishCommit">完成，提交商品</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import SingleUpload from '@/components/Upload/singleUpload'
  import MultiUpload from '@/components/Upload/multiUpload'
  import Tinymce from '@/components/Tinymce'

  export default {
    name: "ProductAttrDetail",
    components: {SingleUpload, MultiUpload, Tinymce},
    props: {
      value: Object,
      isEdit: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        //编辑模式时是否初始化成功
        hasEditCreated: false,
        //商品属性分类下拉选项
        productAttributeCategoryOptions: [],
        //选中的商品属性
        selectProductAttr: [],
        //选中的商品属性图片
        selectProductAttrPics: [],
        //可手动添加的商品属性
        addProductAttrValue: '',
        //商品富文本详情激活类型
        activeHtmlName: 'pc',
        selectProductPics: []
      }
    },
    filters:{
      myFilter:function(data){
        var dd = JSON.parse(data);
        var ss = '';
        dd.forEach(item=>{
          ss+=item.value;
        })
        return ss;
      }
    },
    computed: {
      //是否有商品属性图片
      hasAttrPic() {
        if (this.value.skuStockList.length < 1) {
          return false;
        }
        return true;
      },
      //商品的编号
      productId() {
        return this.value._id;
      }
    },
    created() {
      this.getProductAttrCateList();
    },
    watch: {
      productId: function (newValue) {
        if (!this.isEdit) return;
        if (this.hasEditCreated) return;
        if (newValue === undefined || newValue == null || newValue === 0) return;
        this.handleEditCreated();
      }
    },
    methods: {
      getSkuCode() {
        return ("00" + 1000 * Math.random()).match(/(\d{3})(\.|$)/)[1];
      },
      handleEditCreated() {
        //根据商品属性分类id获取属性和参数
        this.selectProductPics = this.value.pic;
        this.handleProductAttrChange(this.value.productAttributeCategoryId);
        this.hasEditCreated = true;
      },
      getProductAttrCateList() {
        this.$axios.get('/productAttr/all').then(res => {
          this.productAttributeCategoryOptions = res.data.productAttrList;
          this.productAttributeCategoryOptions.forEach(function (item) {
            item.label = item.name;
            item.value = item._id;
          })
        })
      },
      getProductAttrList(cid) {
        var index = 0;
        this.productAttributeCategoryOptions.forEach(function (item, i) {
          if (item._id === cid) {
            index = i;
          }
        });
        this.selectProductAttr = this.productAttributeCategoryOptions[index].attr;
        this.selectProductAttr.forEach(item => {
          this.$set(item, 'values', new Array)
        });
        if (this.isEdit) {
          this.value.skuStockList.forEach(item => {
            var spData = JSON.parse(item.spData);
            spData.forEach(item2 => {
              this.selectProductAttr.forEach(item3 => {
                if (item2.key === item3.name && item3.values.indexOf(item2.value) == -1) {
                  item3.values.push(item2.value);
                }
              })
            });
          })
        }
      },
      handleProductAttrChange(value) {
        this.getProductAttrList(value);
      },
      getProductSkuSp(row, index) {
        let spData = JSON.parse(row.spData);
        if (spData != null && index < spData.length) {
          return spData[index].value;
        } else {
          return null;
        }
      },
      handleRefreshProductSkuList() {
        this.$confirm('确定要刷新sku库存列表吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // this.refreshProductAttrPics();
          this.refreshProductSkuList();
        });
      },
      handleSyncProductSkuPrice() {
        this.$confirm('将同步第一个sku的价格到所有sku,是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.value.skuStockList !== null && this.value.skuStockList.length > 0) {
            let tempSkuList = [];
            tempSkuList = tempSkuList.concat(tempSkuList, this.value.skuStockList);
            let price = this.value.skuStockList[0].price;
            for (let i = 0; i < tempSkuList.length; i++) {
              tempSkuList[i].price = price;
            }
            this.value.skuStockList = [];
            this.value.skuStockList = this.value.skuStockList.concat(this.value.skuStockList, tempSkuList);
          }
        });
      },
      handleSyncProductSkuStock() {
        this.$confirm('将同步第一个sku的库存到所有sku,是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          if (this.value.skuStockList !== null && this.value.skuStockList.length > 0) {
            let tempSkuList = [];
            tempSkuList = tempSkuList.concat(tempSkuList, this.value.skuStockList);
            let stock = this.value.skuStockList[0].stock;
            let lowStock = this.value.skuStockList[0].lowStock;
            for (let i = 0; i < tempSkuList.length; i++) {
              tempSkuList[i].stock = stock;
              tempSkuList[i].lowStock = lowStock;
            }
            this.value.skuStockList = [];
            this.value.skuStockList = this.value.skuStockList.concat(this.value.skuStockList, tempSkuList);
          }
        });
      },
      refreshProductSkuList() {
        let oldSkuStockList = [];
        this.value.skuStockList.forEach(item => {
          oldSkuStockList.push(item);
        });
        this.value.skuStockList = [];
        let skuList = this.value.skuStockList;
        //只有一个属性时
        if (this.selectProductAttr.length === 1) {
          let attr = this.selectProductAttr[0];
          for (let i = 0; i < attr.values.length; i++) {
            skuList.push({
              spData: JSON.stringify([{key: attr.name, value: attr.values[i]}])
            });
          }
        } else if (this.selectProductAttr.length === 2) {
          let attr0 = this.selectProductAttr[0];
          let attr1 = this.selectProductAttr[1];
          for (let i = 0; i < attr0.values.length; i++) {
            if (attr1.values.length === 0) {
              skuList.push({
                spData: JSON.stringify([{key: attr0.name, value: attr0.values[i]}])
              });
              continue;
            }
            for (let j = 0; j < attr1.values.length; j++) {
              let spData = [];
              spData.push({key: attr0.name, value: attr0.values[i]});
              spData.push({key: attr1.name, value: attr1.values[j]});
              skuList.push({
                spData: JSON.stringify(spData)
              });
            }
          }
        } else {
          let attr0 = this.selectProductAttr[0];
          let attr1 = this.selectProductAttr[1];
          let attr2 = this.selectProductAttr[2];
          for (let i = 0; i < attr0.values.length; i++) {
            if (attr1.values.length === 0) {
              skuList.push({
                spData: JSON.stringify([{key: attr0.name, value: attr0.values[i]}])
              });
              continue;
            }
            for (let j = 0; j < attr1.values.length; j++) {
              if (attr2.values.length === 0) {
                let spData = [];
                spData.push({key: attr0.name, value: attr0.values[i]});
                spData.push({key: attr1.name, value: attr1.values[j]});
                skuList.push({
                  spData: JSON.stringify(spData)
                });
                continue;
              }
              for (let k = 0; k < attr2.values.length; k++) {
                let spData = [];
                spData.push({key: attr0.name, value: attr0.values[i]});
                spData.push({key: attr1.name, value: attr1.values[j]});
                spData.push({key: attr2.name, value: attr2.values[k]});
                skuList.push({
                  spData: JSON.stringify(spData)
                });
              }
            }
          }
        }
        ;
        this.value.skuStockList.forEach(item => {
          oldSkuStockList.forEach(item2 => {
            if (item.spData === item2.spData) {
              for (let key in item2) {
                item[key] = item2[key];
              }
            }
          });
          if (item.skuCode === undefined) {
            item.skuCode = this.getSkuCode();
          }
          if (item.pic === undefined){
            item.pic = [];
          }
        })
      },
      refreshProductAttrPics() {
        // this.selectProductAttrPics = [];
        var copy = [];
        this.selectProductAttrPics.forEach(item=>{
          copy.push(item);
        });
        this.selectProductAttrPics = [];
        if (this.selectProductAttr.length >= 1) {
          let values = this.selectProductAttr[0].values;
          if (copy.length === 0){
            for (let i = 0; i < values.length; i++) {
              let pic = [];
              this.selectProductAttrPics.push({name: values[i], pic: pic})
            }
          }
          else{
            for (let i = 0; i < values.length; i++) {
              let pic = [];
              var flag = false;
              copy.forEach(item=>{
                if (item.name === values[i]){
                  flag = true;
                  this.selectProductAttrPics.push(item);
                }
              });
              if (!flag){
                this.selectProductAttrPics.push({name: values[i], pic: pic})
              }
            }
          }
        }
      },
      handleRemoveProductSku(index, row) {
        let list = this.value.skuStockList;
        if (list.length === 1) {
          list.pop();
        } else {
          list.splice(index, 1);
        }
      },
      handlePrev() {
        this.$emit('prevStep')
      },
      handleFinishCommit() {
        // this.value.productAttrPics = this.selectProductAttrPics;
        this.value.pic = this.selectProductPics;
        var num = 0;
        this.value.skuStockList.forEach(item=>{
          num += parseInt(item.stock);
        });
        if (num !== parseInt(this.value.stock)){
          this.$message({
            type:'warning',
            message:'商品库存信息不匹配，请检查后重试'
          });
          return
        }
        this.$emit('finishCommit', this.isEdit);
      }
    }
  }
</script>

<style scoped>
  .cardBg {
    background: #F8F9FC;
  }
</style>
