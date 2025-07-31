import {
  basekit,
  FieldComponent,
  FieldType,
  FieldCode,
  DateFormatter,
} from '@lark-opdev/block-basekit-server-api';

// 安全设置
basekit.addDomainList(['api.exchangerate-api.com']);

// 货币列表
const currencyOptions = [
    { label: 'USD - $ 美元', value: 'USD' },
    { label: 'EUR - € 欧元', value: 'EUR' },
    { label: 'JPY - ¥ 日元', value: 'JPY' },
    { label: 'GBP - £ 英镑', value: 'GBP' },
    { label: 'CNY - ¥ 人民币', value: 'CNY' },
    { label: 'AUD - $ 澳大利亚元', value: 'AUD' },
    { label: 'CAD - $ 加拿大元', value: 'CAD' },
    { label: 'CHF - Fr 瑞士法郎', value: 'CHF' },
    { label: 'HKD - $ 港币', value: 'HKD' },
    { label: 'SGD - $ 新加坡元', value: 'SGD' },
    { label: 'SEK - kr 瑞典克朗', value: 'SEK' },
    { label: 'NOK - kr 挪威克朗', value: 'NOK' },
    { label: 'KRW - ₩ 韩元', value: 'KRW' },
    { label: 'TWD - NT$ 新台币', value: 'TWD' },
    { label: 'NZD - $ 新西兰元', value: 'NZD' },
    { label: 'THB - ฿ 泰国铢', value: 'THB' },
    { label: 'PHP - ₱ 菲律宾比索', value: 'PHP' },
    { label: 'IDR - Rp 印度尼西亚盾', value: 'IDR' },
    { label: 'MYR - RM 马来西亚林吉特', value: 'MYR' },
    { label: 'RUB - ₽ 俄罗斯卢布', value: 'RUB' },
    { label: 'INR - ₹ 印度卢比', value: 'INR' },
    { label: 'BRL - R$ 巴西雷亚尔', value: 'BRL' },
    { label: 'ZAR - R 南非兰特', value: 'ZAR' },
    { label: 'MXN - $ 墨西哥比索', value: 'MXN' },
    { label: 'PLN - zł 波兰兹罗提', value: 'PLN' },
    // ... 更多货币
];

basekit.addField({
  formItems: [
    {
      key: 'sourceAmountField',
      label: '选择金额字段',
      component: FieldComponent.FieldSelect,
      props: { supportType: [FieldType.Number] },
      validator: { required: true },
    },
    {
      key: 'sourceCurrency',
      label: '选择源货币',
      component: FieldComponent.SingleSelect,
      defaultValue: { label: 'CNY - ¥ 人民币', value: 'CNY' },
      props: { options: currencyOptions },
      validator: { required: true },
    },
    {
      key: 'targetCurrency',
      label: '选择目标货币',
      component: FieldComponent.SingleSelect,
      defaultValue: { label: 'USD - $ 美元', value: 'USD' },
      props: { options: currencyOptions },
      validator: { required: true },
    },
  ],

  resultType: {
    type: FieldType.Object,
    extra: {
      icon: {
        light: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/eqgeh7upeubqnulog/chatbot.svg',
      },
      properties: [
        { key: 'id', type: FieldType.Text, title: 'ID', isGroupByKey: true, hidden: true },
        { key: 'amount', type: FieldType.Number, title: '换算金额', primary: true },
        {
          key: 'rateInfo',
          type: FieldType.Number, 
          title: '参考汇率',
        },
      ],
    },
  },

  execute: async (formItemParams, context) => {
    try {
      const { sourceAmountField, sourceCurrency, targetCurrency } = formItemParams;
      const amount = sourceAmountField as number;
      const fromCurrency = sourceCurrency.value;
      const toCurrency = targetCurrency.value;

      if (typeof amount !== 'number') { return { code: FieldCode.InvalidArgument, data: null }; }
      
      let rateForInfo = 1.0; 
      if (fromCurrency === toCurrency) {
        return { code: FieldCode.Success, data: { id: Date.now().toString(), amount, rateInfo: rateForInfo } };
      }

      const apiUrl = `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`;
      const response = await context.fetch(apiUrl);

      if (!response.ok) { return { code: FieldCode.Error, data: null }; }

      const exchangeData = await response.json();
      const rate = exchangeData?.rates?.[toCurrency];
      
      if (!rate) { return { code: FieldCode.Error, data: null }; }

      const result = amount * rate;
      rateForInfo = parseFloat(rate.toFixed(4));

      return {
        code: FieldCode.Success,
        data: {
          id: Date.now().toString(),
          amount: result,
          rateInfo: rateForInfo,
        },
      };
    } catch (e) {
      console.log(JSON.stringify({ logID: context.logID, error: e.toString() }));
      return { code: FieldCode.Error, data: null };
    }
  },
});

export default basekit;