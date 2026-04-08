        const lunarDataMap = {
            2025: {
                days: [29, 30, 29, 30, 29, 30, 30, 29, 30, 29, 30, 29],
                leapMonth: 6, // 闰六月
                leapDays: 29,
                startSolarDate: '2025-01-29',
                solarYear: 2025
            },
            2026: {
                days: [30, 29, 30, 29, 30, 29, 30, 30, 29, 30, 29, 30],
                leapMonth: 0,
                leapDays: 0,
                startSolarDate: '2026-02-17',
                solarYear: 2026
            }
        };

        function calculateLunar(solarDate) {
            const lunars = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十', '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十', '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];
            const months = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '冬月', '腊月'];

            const solarYear = solarDate.getFullYear();
            
            // Map the date to the correct Lunar Year boundary based on Spring Festival
            let targetLunarYear = solarYear;
            if (solarYear === 2025 && solarDate < new Date('2025-01-29')) {
                // If before 2025 Spring Festival, we don't have 2024 data, just mock it
                return '前历';
            }
            if (solarYear === 2026 && solarDate < new Date('2026-02-17')) {
                targetLunarYear = 2025;
            }
            if (solarYear > 2026) {
                return '后历';
            }
            if(solarYear < 2025) {
                return '前历';
            }

            const lData = lunarDataMap[targetLunarYear];
            let diffDays = Math.floor((solarDate.getTime() - new Date(lData.startSolarDate).getTime()) / 86400000);
            
            let monthIdx = 0;
            let isLeap = false;
            
            for (let i = 0; i < lData.days.length; i++) {
                // Check normal month
                if (diffDays < lData.days[i]) {
                    monthIdx = i;
                    break;
                }
                diffDays -= lData.days[i];
                
                // Check if this month has a leap month immediately following it
                if (lData.leapMonth === (i + 1)) {
                    if (diffDays < lData.leapDays) {
                        monthIdx = i;
                        isLeap = true;
                        break;
                    }
                    diffDays -= lData.leapDays;
                }
            }

            if (diffDays === 0) {
                if(isLeap) return `闰${months[monthIdx]}`;
                return months[monthIdx];
            }
            return lunars[diffDays];
        }
