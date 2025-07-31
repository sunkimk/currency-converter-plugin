"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_basekit_server_api_1 = require("@lark-opdev/block-basekit-server-api");
// 安全设置
block_basekit_server_api_1.basekit.addDomainList(['api.exchangerate-api.com']);
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
block_basekit_server_api_1.basekit.addField({
    formItems: [
        {
            key: 'sourceAmountField',
            label: '选择金额字段',
            component: block_basekit_server_api_1.FieldComponent.FieldSelect,
            props: { supportType: [block_basekit_server_api_1.FieldType.Number] },
            validator: { required: true },
        },
        {
            key: 'sourceCurrency',
            label: '选择源货币',
            component: block_basekit_server_api_1.FieldComponent.SingleSelect,
            defaultValue: { label: 'CNY - ¥ 人民币', value: 'CNY' },
            props: { options: currencyOptions },
            validator: { required: true },
        },
        {
            key: 'targetCurrency',
            label: '选择目标货币',
            component: block_basekit_server_api_1.FieldComponent.SingleSelect,
            defaultValue: { label: 'USD - $ 美元', value: 'USD' },
            props: { options: currencyOptions },
            validator: { required: true },
        },
    ],
    resultType: {
        type: block_basekit_server_api_1.FieldType.Object,
        extra: {
            icon: {
                light: 'https://lf3-static.bytednsdoc.com/obj/eden-cn/eqgeh7upeubqnulog/chatbot.svg',
            },
            properties: [
                { key: 'id', type: block_basekit_server_api_1.FieldType.Text, title: 'ID', isGroupByKey: true, hidden: true },
                { key: 'amount', type: block_basekit_server_api_1.FieldType.Number, title: '换算金额', primary: true },
                {
                    key: 'rateInfo',
                    type: block_basekit_server_api_1.FieldType.Number,
                    title: '参考汇率',
                },
            ],
        },
    },
    execute: async (formItemParams, context) => {
        try {
            const { sourceAmountField, sourceCurrency, targetCurrency } = formItemParams;
            const amount = sourceAmountField;
            const fromCurrency = sourceCurrency.value;
            const toCurrency = targetCurrency.value;
            if (typeof amount !== 'number') {
                return { code: block_basekit_server_api_1.FieldCode.InvalidArgument, data: null };
            }
            let rateForInfo = 1.0;
            if (fromCurrency === toCurrency) {
                return { code: block_basekit_server_api_1.FieldCode.Success, data: { id: Date.now().toString(), amount, rateInfo: rateForInfo } };
            }
            const apiUrl = `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`;
            const response = await context.fetch(apiUrl);
            if (!response.ok) {
                return { code: block_basekit_server_api_1.FieldCode.Error, data: null };
            }
            const exchangeData = await response.json();
            const rate = exchangeData?.rates?.[toCurrency];
            if (!rate) {
                return { code: block_basekit_server_api_1.FieldCode.Error, data: null };
            }
            const result = amount * rate;
            rateForInfo = parseFloat(rate.toFixed(4));
            return {
                code: block_basekit_server_api_1.FieldCode.Success,
                data: {
                    id: Date.now().toString(),
                    amount: result,
                    rateInfo: rateForInfo,
                },
            };
        }
        catch (e) {
            console.log(JSON.stringify({ logID: context.logID, error: e.toString() }));
            return { code: block_basekit_server_api_1.FieldCode.Error, data: null };
        }
    },
});
exports.default = block_basekit_server_api_1.basekit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtRkFNOEM7QUFFOUMsT0FBTztBQUNQLGtDQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsMEJBQTBCLENBQUMsQ0FBQyxDQUFDO0FBRXBELE9BQU87QUFDUCxNQUFNLGVBQWUsR0FBRztJQUNwQixFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTtJQUNyQyxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTtJQUNyQyxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTtJQUNyQyxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTtJQUNyQyxFQUFFLEtBQUssRUFBRSxhQUFhLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTtJQUN0QyxFQUFFLEtBQUssRUFBRSxlQUFlLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTtJQUN4QyxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTtJQUN2QyxFQUFFLEtBQUssRUFBRSxlQUFlLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTtJQUN4QyxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTtJQUNyQyxFQUFFLEtBQUssRUFBRSxjQUFjLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTtJQUN2QyxFQUFFLEtBQUssRUFBRSxlQUFlLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTtJQUN4QyxFQUFFLEtBQUssRUFBRSxlQUFlLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTtJQUN4QyxFQUFFLEtBQUssRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRTtJQUNyQyxFQUFFLEtBQUssRUFBRSxl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