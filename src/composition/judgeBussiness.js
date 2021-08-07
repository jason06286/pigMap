import { reactive, ref, watch } from 'vue';

export default function judgeBusiness(a) {
    // 判斷是否在營業時間內
    const weekArray = reactive({
        arr: [
            '星期日',
            '星期一',
            '星期二',
            '星期三',
            '星期四',
            '星期五',
            '星期六',
        ],
    });
    const nowWeek = ref(weekArray.arr[new Date().getDay()]);

    const isBusiness = (week, start, end) => {
        if (week.match(nowWeek.value) === null) return false;
        const startTime = start.split(':');
        const endTime = end.split(':');
        const nowHour = new Date().getHours();
        const nowMinutes = new Date().getMinutes();
        let nowTimestamp = nowHour * 60 + nowMinutes;
        const startTimeStamp = +startTime[0] * 60 + +startTime[1];
        let endTimeStamp = 0;
        if (+endTime[0] < +startTime[0]) {
            endTimeStamp = endTime[0] * 60 + +endTime[1] + 1440;
            nowTimestamp = nowTimestamp + 1440;
        } else {
            endTimeStamp = endTime[0] * 60 + +endTime[1];
        }
        if (nowTimestamp > startTimeStamp && nowTimestamp <= endTimeStamp) {
            return true;
        }
        return false;
    }
    // 判斷禮拜幾有營業
    const judgeWeek = (week, business) => {
        const businessWeek = business.split('，');
        if (businessWeek.indexOf(week) !== -1) return true;
        return false;
    }
    // 判斷是否顯示所有營業時間
    const isShow = ref(false);
    const isShowBusiness = ref('');

    const showBusiness = (id) => {
        isShowBusiness.value = id;
        isShow.value = !isShow.value;
    }

    watch(isShowBusiness, () => {
        isShow.value = true;
    });

    return {
        isBusiness,
        weekArray,

        judgeWeek,
        nowWeek,

        isShow,
        isShowBusiness,
        showBusiness,
    };
}