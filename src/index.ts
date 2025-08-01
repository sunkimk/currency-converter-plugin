import {
  basekit,
  FieldComponent,
  FieldType,
  FieldCode,
  DateFormatter,
  field,
} from '@lark-opdev/block-basekit-server-api';

const { t } = field;

// 安全设置
basekit.addDomainList(['api.exchangerate-api.com']);

// 1. 定义一个完整的、不含任何语言的“基础货币”数据
const BASE_CURRENCIES = [
    { code: 'USD', symbol: '$' }, { code: 'EUR', symbol: '€' }, { code: 'JPY', symbol: '¥' },
    { code: 'GBP', symbol: '£' }, { code: 'CNY', symbol: '¥' }, { code: 'AUD', symbol: '$' },
    { code: 'CAD', symbol: '$' }, { code: 'CHF', symbol: 'Fr' }, { code: 'HKD', symbol: '$' },
    { code: 'SGD', symbol: '$' }, { code: 'SEK', symbol: 'kr' }, { code: 'NOK', symbol: 'kr' },
    { code: 'KRW', symbol: '₩' }, { code: 'TWD', symbol: 'NT$' }, { code: 'NZD', symbol: '$' },
    { code: 'THB', symbol: '฿' }, { code: 'PHP', symbol: '₱' }, { code: 'IDR', symbol: 'Rp' },
    { code: 'MYR', symbol: 'RM' }, { code: 'RUB', symbol: '₽' }, { code: 'INR', symbol: '₹' },
    { code: 'BRL', symbol: 'R$' }, { code: 'ZAR', symbol: 'R' }, { code: 'MXN', symbol: '$' },
    { code: 'PLN', symbol: 'zł' }, { code: 'TRY', symbol: '₺' }, { code: 'DKK', symbol: 'kr' },
    { code: 'HUF', symbol: 'Ft' }, { code: 'CZK', symbol: 'Kč' }, { code: 'ILS', symbol: '₪' },
    { code: 'CLP', symbol: '$' }, { code: 'AED', symbol: 'dh' }, { code: 'SAR', symbol: '﷼' },
    { code: 'VND', symbol: '₫' }, { code: 'UAH', symbol: '₴' }, { code: 'COP', symbol: '$' },
    { code: 'ARS', symbol: '$' }, { code: 'RON', symbol: 'lei' }, { code: 'BGN', symbol: 'лв' },
    { code: 'EGP', symbol: '£' }, { code: 'PKR', symbol: '₨' }, { code: 'IQD', symbol: 'din' },
    { code: 'QAR', symbol: '﷼' }, { code: 'KWD', symbol: 'din' }, { code: 'OMR', symbol: '﷼' },
    { code: 'JOD', symbol: 'din' }, { code: 'BHD', symbol: 'din' }, { code: 'LBP', symbol: '£' },
    { code: 'MAD', symbol: 'dh' }, { code: 'DZD', symbol: 'din' }, { code: 'TND', symbol: 'din' },
    { code: 'NGN', symbol: '₦' }, { code: 'GHS', symbol: '₵' }, { code: 'KES', symbol: 'KSh' },
    { code: 'UGX', symbol: 'USh' }, { code: 'TZS', symbol: 'TSh' }, { code: 'ETB', symbol: 'Br' },
    { code: 'BDT', symbol: '৳' }, { code: 'LKR', symbol: '₨' }, { code: 'NPR', symbol: '₨' },
    { code: 'UZS', symbol: 'лв' }, { code: 'KZT', symbol: '〒' }, { code: 'AZN', symbol: '₼' },
];

basekit.addField({
  // 2. 在 i18n 语言包中为所有货币添加翻译
  i18n: {
    messages: {
      'zh-CN': {
        amount_field_label: '选择金额字段', source_currency_label: '选择源货币', target_currency_label: '选择目标货币',
        converted_amount_title: '换算金额', ref_rate_title: '参考汇率',
        currency_usd: 'USD - $ 美元', currency_eur: 'EUR - € 欧元', currency_jpy: 'JPY - ¥ 日元',
        currency_gbp: 'GBP - £ 英镑', currency_cny: 'CNY - ¥ 人民币', currency_aud: 'AUD - $ 澳大利亚元',
        currency_cad: 'CAD - $ 加拿大元', currency_chf: 'CHF - Fr 瑞士法郎', currency_hkd: 'HKD - $ 港币',
        currency_sgd: 'SGD - $ 新加坡元', currency_sek: 'SEK - kr 瑞典克朗', currency_nok: 'NOK - kr 挪威克朗',
        currency_krw: 'KRW - ₩ 韩元', currency_twd: 'TWD - NT$ 新台币', currency_nzd: 'NZD - $ 新西兰元',
        currency_thb: 'THB - ฿ 泰国铢', currency_php: 'PHP - ₱ 菲律宾比索', currency_idr: 'IDR - Rp 印度尼西亚盾',
        currency_myr: 'MYR - RM 马来西亚林吉特', currency_rub: 'RUB - ₽ 俄罗斯卢布', currency_inr: 'INR - ₹ 印度卢比',
        currency_brl: 'BRL - R$ 巴西雷亚尔', currency_zar: 'ZAR - R 南非兰特', currency_mxn: 'MXN - $ 墨西哥比索',
        currency_pln: 'PLN - zł 波兰兹罗提', currency_try: 'TRY - ₺ 土耳其里拉', currency_dkk: 'DKK - kr 丹麦克朗',
        currency_huf: 'HUF - Ft 匈牙利福林', currency_czk: 'CZK - Kč 捷克克朗', currency_ils: 'ILS - ₪ 以色列新谢克尔',
        currency_clp: 'CLP - $ 智利比索', currency_aed: 'AED - dh 阿联酋迪拉姆', currency_sar: 'SAR - ﷼ 沙特里亚尔',
        currency_vnd: 'VND - ₫ 越南盾', currency_uah: 'UAH - ₴ 乌克兰格里夫纳', currency_cop: 'COP - $ 哥伦比亚比索',
        currency_ars: 'ARS - $ 阿根廷比索', currency_ron: 'RON - lei 罗马尼亚列伊', currency_bgn: 'BGN - лв 保加利亚列弗',
        currency_egp: 'EGP - £ 埃及镑', currency_pkr: 'PKR - ₨ 巴基斯坦卢比', currency_iqd: 'IQD - din 伊拉克第纳尔',
        currency_qar: 'QAR - ﷼ 卡塔尔里亚尔', currency_kwd: 'KWD - din 科威特第纳尔', currency_omr: 'OMR - ﷼ 阿曼里亚尔',
        currency_jod: 'JOD - din 约旦第纳尔', currency_bhd: 'BHD - din 巴林第纳尔', currency_lbp: 'LBP - £ 黎巴嫩镑',
        currency_mad: 'MAD - dh 摩洛哥迪拉姆', currency_dzd: 'DZD - din 阿尔及利亚第纳尔', currency_tnd: 'TND - din 突尼斯第纳尔',
        currency_ngn: 'NGN - ₦ 尼日利亚奈拉', currency_ghs: 'GHS - ₵ 加纳塞地', currency_kes: 'KES - KSh 肯尼亚先令',
        currency_ugx: 'UGX - USh 乌干达先令', currency_tzs: 'TZS - TSh 坦桑尼亚先令', currency_etb: 'ETB - Br 埃塞俄比亚比尔',
        currency_bdt: 'BDT - ৳ 孟加拉塔卡', currency_lkr: 'LKR - ₨ 斯里兰卡卢比', currency_npr: 'NPR - ₨ 尼泊尔卢比',
        currency_uzs: 'UZS - лв 乌兹别克斯坦苏姆', currency_kzt: 'KZT - 〒 哈萨克斯坦坚戈', currency_azn: 'AZN - ₼ 阿塞拜疆马纳特',
      },
      'en-US': {
        amount_field_label: 'Select Amount Field', source_currency_label: 'Select Source Currency', target_currency_label: 'Select Target Currency',
        converted_amount_title: 'Converted Amount', ref_rate_title: 'Reference Rate',
        currency_usd: 'USD - $ US Dollar', currency_eur: 'EUR - € Euro', currency_jpy: 'JPY - ¥ Japanese Yen',
        currency_gbp: 'GBP - £ British Pound', currency_cny: 'CNY - ¥ Chinese Yuan', currency_aud: 'AUD - $ Australian Dollar',
        currency_cad: 'CAD - $ Canadian Dollar', currency_chf: 'CHF - Fr Swiss Franc', currency_hkd: 'HKD - $ Hong Kong Dollar',
        currency_sgd: 'SGD - $ Singapore Dollar', currency_sek: 'SEK - kr Swedish Krona', currency_nok: 'NOK - kr Norwegian Krone',
        currency_krw: 'KRW - ₩ South Korean Won', currency_twd: 'TWD - NT$ New Taiwan Dollar', currency_nzd: 'NZD - $ New Zealand Dollar',
        currency_thb: 'THB - ฿ Thai Baht', currency_php: 'PHP - ₱ Philippine Peso', currency_idr: 'IDR - Rp Indonesian Rupiah',
        currency_myr: 'MYR - RM Malaysian Ringgit', currency_rub: 'RUB - ₽ Russian Ruble', currency_inr: 'INR - ₹ Indian Rupee',
        currency_brl: 'BRL - R$ Brazilian Real', currency_zar: 'ZAR - R South African Rand', currency_mxn: 'MXN - $ Mexican Peso',
        currency_pln: 'PLN - zł Polish Złoty', currency_try: 'TRY - ₺ Turkish Lira', currency_dkk: 'DKK - kr Danish Krone',
        currency_huf: 'HUF - Ft Hungarian Forint', currency_czk: 'CZK - Kč Czech Koruna', currency_ils: 'ILS - ₪ Israeli New Shekel',
        currency_clp: 'CLP - $ Chilean Peso', currency_aed: 'AED - dh UAE Dirham', currency_sar: 'SAR - ﷼ Saudi Riyal',
        currency_vnd: 'VND - ₫ Vietnamese Dong', currency_uah: 'UAH - ₴ Ukrainian Hryvnia', currency_cop: 'COP - $ Colombian Peso',
        currency_ars: 'ARS - $ Argentine Peso', currency_ron: 'RON - lei Romanian Leu', currency_bgn: 'BGN - лв Bulgarian Lev',
        currency_egp: 'EGP - £ Egyptian Pound', currency_pkr: 'PKR - ₨ Pakistani Rupee', currency_iqd: 'IQD - din Iraqi Dinar',
        currency_qar: 'QAR - ﷼ Qatari Riyal', currency_kwd: 'KWD - din Kuwaiti Dinar', currency_omr: 'OMR - ﷼ Omani Rial',
        currency_jod: 'JOD - din Jordanian Dinar', currency_bhd: 'BHD - din Bahraini Dinar', currency_lbp: 'LBP - £ Lebanese Pound',
        currency_mad: 'MAD - dh Moroccan Dirham', currency_dzd: 'DZD - din Algerian Dinar', currency_tnd: 'TND - din Tunisian Dinar',
        currency_ngn: 'NGN - ₦ Nigerian Naira', currency_ghs: 'GHS - ₵ Ghanaian Cedi', currency_kes: 'KES - KSh Kenyan Shilling',
        currency_ugx: 'UGX - USh Ugandan Shilling', currency_tzs: 'TZS - TSh Tanzanian Shilling', currency_etb: 'ETB - Br Ethiopian Birr',
        currency_bdt: 'BDT - ৳ Bangladeshi Taka', currency_lkr: 'LKR - ₨ Sri Lankan Rupee', currency_npr: 'NPR - ₨ Nepalese Rupee',
        currency_uzs: 'UZS - лв Uzbekistani Som', currency_kzt: 'KZT - 〒 Kazakhstani Tenge', currency_azn: 'AZN - ₼ Azerbaijani Manat',
      },
      'ja-JP': {
        amount_field_label: '金額フィールドを選択', source_currency_label: '換算元の通貨を選択', target_currency_label: '換算先の通貨を選択',
        converted_amount_title: '換算後の金額', ref_rate_title: '参考為替レート',
        currency_usd: 'USD - $ 米ドル', currency_eur: 'EUR - € ユーロ', currency_jpy: 'JPY - ¥ 円',
        currency_gbp: 'GBP - £ 英ポンド', currency_cny: 'CNY - ¥ 人民元', currency_aud: 'AUD - $ オーストラリア・ドル',
        currency_cad: 'CAD - $ カナダ・ドル', currency_chf: 'CHF - Fr スイス・フラン', currency_hkd: 'HKD - $ 香港ドル',
        currency_sgd: 'SGD - $ シンガポール・ドル', currency_sek: 'SEK - kr スウェーデン・クローナ', currency_nok: 'NOK - kr ノルウェー・クローネ',
        currency_krw: 'KRW - ₩ 韓国ウォン', currency_twd: 'TWD - NT$ 新台湾ドル', currency_nzd: 'NZD - $ ニュージーランド・ドル',
        currency_thb: 'THB - ฿ タイ・バーツ', currency_php: 'PHP - ₱ フィリピン・ペソ', currency_idr: 'IDR - Rp インドネシア・ルピア',
        currency_myr: 'MYR - RM マレーシア・リンギット', currency_rub: 'RUB - ₽ ロシア・ルーブル', currency_inr: 'INR - ₹ インド・ルピー',
        currency_brl: 'BRL - R$ ブラジル・レアル', currency_zar: 'ZAR - R 南アフリカ・ランド', currency_mxn: 'MXN - $ メキシコ・ペソ',
        currency_pln: 'PLN - zł ポーランド・ズウォティ', currency_try: 'TRY - ₺ トルコ・リラ', currency_dkk: 'DKK - kr デンマーク・クローネ',
        currency_huf: 'HUF - Ft ハンガリー・フォリント', currency_czk: 'CZK - Kč チェコ・コルナ', currency_ils: 'ILS - ₪ イスラエル・シュケル',
        currency_clp: 'CLP - $ チリ・ペソ', currency_aed: 'AED - dh UAEディルハム', currency_sar: 'SAR - ﷼ サウジアラビア・リヤル',
        currency_vnd: 'VND - ₫ ベトナム・ドン', currency_uah: 'UAH - ₴ ウクライナ・フリヴニャ', currency_cop: 'COP - $ コロンビア・ペソ',
        currency_ars: 'ARS - $ アルゼンチン・ペソ', currency_ron: 'RON - lei ルーマニア・レウ', currency_bgn: 'BGN - лв ブルガリア・レフ',
        currency_egp: 'EGP - £ エジプト・ポンド', currency_pkr: 'PKR - ₨ パキスタン・ルピー', currency_iqd: 'IQD - din イラク・ディナール',
        currency_qar: 'QAR - ﷼ カタール・リヤル', currency_kwd: 'KWD - din クウェート・ディナール', currency_omr: 'OMR - ﷼ オマーン・リアル',
        currency_jod: 'JOD - din ヨルダン・ディナール', currency_bhd: 'BHD - din バーレーン・ディナール', currency_lbp: 'LBP - £ レバノン・ポンド',
        currency_mad: 'MAD - dh モロッコ・ディルハム', currency_dzd: 'DZD - din アルジェリア・ディナール', currency_tnd: 'TND - din チュニジア・ディナール',
        currency_ngn: 'NGN - ₦ ナイジェリア・ナイラ', currency_ghs: 'GHS - ₵ ガーナ・セディ', currency_kes: 'KES - KSh ケニア・シリング',
        currency_ugx: 'UGX - USh ウガンダ・シリング', currency_tzs: 'TZS - TSh タンザニア・シリング', currency_etb: 'ETB - Br エチオピア・ブル',
        currency_bdt: 'BDT - ৳ バングラデシュ・タカ', currency_lkr: 'LKR - ₨ スリランカ・ルピー', currency_npr: 'NPR - ₨ ネパール・ルピー',
        currency_uzs: 'UZS - лв ウズベキスタン・スム', currency_kzt: 'KZT - 〒 カザフスタン・テンゲ', currency_azn: 'AZN - ₼ アゼルバイジャン・マナト',
      },
    }
  },

  formItems: [
    {
      key: 'sourceAmountField',
      label: t('amount_field_label'),
      component: FieldComponent.FieldSelect,
      props: { supportType: [FieldType.Number] },
      validator: { required: true },
    },
    {
      key: 'sourceCurrency',
      label: t('source_currency_label'),
      component: FieldComponent.SingleSelect,
      defaultValue: { label: t('currency_cny'), value: 'CNY' },
      props: { 
        options: BASE_CURRENCIES.map(c => ({
            label: t(`currency_${c.code.toLowerCase()}`),
            value: c.code
        }))
      },
      validator: { required: true },
    },
    {
      key: 'targetCurrency',
      label: t('target_currency_label'),
      component: FieldComponent.SingleSelect,
      defaultValue: { label: t('currency_usd'), value: 'USD' },
      props: { 
        options: BASE_CURRENCIES.map(c => ({
            label: t(`currency_${c.code.toLowerCase()}`),
            value: c.code
        }))
      },
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
        { key: 'amount', type: FieldType.Number, title: t('converted_amount_title'), primary: true },
        {
          key: 'rateInfo',
          type: FieldType.Number, 
          title: t('ref_rate_title'),
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
