window.mCAPConfig = window.mCAPConfig || {};

window.mCAPConfig.defaultStage = 'dev';
//current:stage:identifier
window.mCAPConfig.baseUrl = '';
window.mCAPConfig.baseUrlProd = '';
window.mCAPConfig.baseUrlDev = '';

window.mCAPConfig.getBaseUrl = function (stage) {
    switch (stage || window.mCAPConfig.defaultStage) {
        case "dev":
            return window.mCAPConfig.baseUrlDev;
            break;
        case "prod":
            return window.mCAPConfig.baseUrlProd;break;
        //current:stage:case
        default:
            return '';
    }
};
