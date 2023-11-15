$(function () {
    //google analytics reporting api v4
    function formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    var link_1hr = "https://www.googleapis.com/analytics/v3/data/ga?ids=ga%3A208306526&start-date=2019-12-01&end-date=today&metrics=ga%3Ausers%2Cga%3Asessions&access_token=ya29.a0AfH6SMCliIjRjpbHob3Yaq2jZtCmz-O_v2VDPG58vuam_x_sQU2RckZd0dViP5axCa-KeThlW3QRCCwDyQw8XyXh97CpYv2XcdxnTV0232vjZdQLHPWOpw2GggG67GulYz4dgIPKMTVhF-UYb488mDlvpGnabw";
    $(function () {
        $('.page_views').html('<i class="fas fa-users"></i> <span>Users : 2,609</span> | <i class="far fa-eye"></i> <span>Sessions : 13,253</span>');
        $.getJSON(link_1hr, function (data, textStatus, jqXHR) {
            var users = data.rows[0][0];
            var views = data.rows[0][1];
            if (users&&views) {
                $('.page_views').html('<i class="fas fa-users"></i> <span>Users : ' + formatNumber(users) + '</span> | <i class="far fa-eye"></i> <span>Sessions : ' + formatNumber(views) + '</span>');
            } else {
            }
        });
    });
});