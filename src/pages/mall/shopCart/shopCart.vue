<template>
  <div class="shop-cart">
    <HeaderSlot>
      <span @click="isDel = !isDel">{{isDel ? '完成' : '管理'}}</span>
    </HeaderSlot>
    <van-checkbox-group class="card-goods" v-model="checkedGoods">
      <van-checkbox
        class="card-goods__item"
        v-for="item in goods"
        :key="item.id"
        :name="item.id"
      >
        <van-card
          :title="item.title"
          :desc="item.desc"
          :num="item.num"
          :price="formatPrice(item.price)"
          :thumb="item.thumb"
        />
      </van-checkbox>
    </van-checkbox-group>
    <van-submit-bar
      class="submit-bar"
      :price="totalPrice"
      :disabled="!checkedGoods.length"
      :button-text="submitBarText"
      @submit="onSubmit"
    >
      <van-checkbox v-model="checked">全选</van-checkbox>
      <!--<span slot="tip">
        你的收货地址不支持同城送, <span>修改地址</span>
      </span>-->
    </van-submit-bar>
  </div>
</template>

<script>
  import { Checkbox, CheckboxGroup, Card, SubmitBar, Toast } from 'vant';
  import HeaderSlot from '@/components/layout/headerSlot';
  export default {
    name: 'shopCart',
    components: {
      [Card.name]: Card,
      [Checkbox.name]: Checkbox,
      [SubmitBar.name]: SubmitBar,
      [CheckboxGroup.name]: CheckboxGroup,
      HeaderSlot
    },
    data() {
      return {
        isDel: false, // true，选择后用于删除，false选择后用于购物作用
        checked: false,
        checkedGoods: ['1', '2', '3'],
        goods: [{
          id: '1',
          title: '进口香蕉',
          desc: '约250g，2根',
          price: 200,
          num: 1,
          thumb: 'https://img.yzcdn.cn/public_files/2017/10/24/2f9a36046449dafb8608e99990b3c205.jpeg'
        }, {
          id: '2',
          title: '陕西蜜梨',
          desc: '约600g',
          price: 690,
          num: 1,
          thumb: 'https://img.yzcdn.cn/public_files/2017/10/24/f6aabd6ac5521195e01e8e89ee9fc63f.jpeg'
        }, {
          id: '3',
          title: '美国伽力果',
          desc: '约680g/3个',
          price: 2680,
          num: 1,
          thumb: 'https://img.yzcdn.cn/public_files/2017/10/24/320454216bbe9e25c7651e1fa51b31fd.jpeg'
        }]
      };
    },
    computed: {
      submitBarText() {
        const count = this.checkedGoods.length;
        let text = this.isDel ? '删除' : '结算';
        return text + (count ? `(${count})` : '');
      },
      totalPrice() {
        return this.goods.reduce((total, item) => total + (this.checkedGoods.indexOf(item.id) !== -1 ? item.price : 0), 0);
      }
    },
    methods: {
      formatPrice(price) {
        return (price / 100).toFixed(2);
      },
      onSubmit() {
        Toast('点击结算');
      }
    }
  };
</script>

<style lang="scss" scoped>
  .shop-cart{
    .card-goods {
      padding: 10px;
      background-color: #fff;
      .card-goods__item {
        position: relative;
        background-color: #fafafa;
        .van-checkbox__label {
          width: 100%;
          height: auto; // temp
          padding: 0 10px 0 15px;
          box-sizing: border-box;
        }
        .van-checkbox__icon {
          top: 50%;
          left: 10px;
          z-index: 1;
          position: absolute;
          margin-top: -10px;
        }
        .van-card__price {
          color: #f44;
        }
      }
    }
    .submit-bar{
      padding-left: 10px;
    }
  }
</style>
