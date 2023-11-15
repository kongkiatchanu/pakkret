$(function () {
    if ($('.map').length > 0) {
        var width_window = $(window).width();
        var zoom_map;
        if (width_window < 1600) {
            zoom_map = 12;
        } else {
            zoom_map = 12;
        }
        $('.aqi .dropdown-item').on('click', function (e) {
            var data_index = $(this).attr('data-index');
            var name_index = $(this).html();
            $('.aqi .dropdown-toggle').html('<span class="fade_in_ture"> ' + name_index + ' </span>');
            if(data_index =='th-hr'){
                if($('.cate_th').css('display') == 'none'){
                    $('.cate_us').hide();
                    $('.cate_us_daily').hide();
                    $('.cate_th').show();
                    $('.cate_th_daily').hide();
                }
            }else if(data_index =='th-dy'){
                if($('.cate_th_daily').css('display') == 'none'){
                    $('.cate_us').hide();
                    $('.cate_us_daily').hide();
                    $('.cate_th').hide();
                    $('.cate_th_daily').show();
                }
            }else if(data_index =='us-hr'){
                if($('.cate_us').css('display') == 'none'){
                    $('.cate_us').show();
                    $('.cate_us_daily').hide();
                    $('.cate_th').hide();
                    $('.cate_th_daily').hide();
                }
            }else if(data_index =='us-dy'){
                if($('.cate_us_daily').css('display') == 'none'){
                    $('.cate_us').hide();
                    $('.cate_us_daily').show();
                    $('.cate_th').hide();
                    $('.cate_th_daily').hide();
                }
            }
            $('.aqi .dropdown-item').removeClass('active');
            $(this).addClass('active');
            $('#popupDetail').hide();
        });
        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        var normalMap = L.tileLayer.ThaiProvider('Google.Normal.Map', {
            maxZoom: 18,
            minZoom: 5,
            attribution: '&copy; <a href="https://www.cmuccdc.org/">cmuccdc.org</a>'
        }),
        satelliteMap = L.tileLayer.ThaiProvider('Google.Satellite.Map', {
            maxZoom: 18,
            minZoom: 5,
            attribution: '&copy; <a href="https://www.cmuccdc.org/">cmuccdc.org</a>'
        });
        OpenStreetMap_Mapnik = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            minZoom: 5,
            attribution: '&copy; <a href="https://www.cmuccdc.org/">cmuccdc.org</a>'
        });
        Esri_WorldLightCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
            maxZoom: 16,
            minZoom: 5,
            attribution: '&copy; <a href="https://www.cmuccdc.org/">cmuccdc.org</a>'
        });
        Esri_WorldDarkCanvas = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
            maxZoom: 16,
            minZoom: 5,
            attribution: '&copy; <a href="https://www.cmuccdc.org/">cmuccdc.org</a>'
        });
        var baseLayers = {
            "Normal map": normalMap,
            "Satellite map": satelliteMap,
            "OpenStreetMap map": OpenStreetMap_Mapnik,
            "Light map": Esri_WorldLightCanvas,
            "Dark map": Esri_WorldDarkCanvas
        }
        var map = L.map('us_map', {
            layers: [normalMap],
            attributionControl: false
        });
        L.control.layers(baseLayers).addTo(map);

        map.createPane('labels');
        map.getPane('labels').style.zIndex = 650;
        map.getPane('labels').style.pointerEvents = 'none';
        map.setView({
            lat: 13.915715,
            lng: 100.5305501
        }, zoom_map);
        //Locate
        var lc = L.control.locate({
            position: "topleft",
            strings: {
                title: "My location"
            },
            locateOptions: {
                enableHighAccuracy: true
            },
        }).addTo(map);
        $.getJSON("https://www.cmuccdc.org/api/ccdc_2/pakkret?v=1222", function (db) {
            if (db) {
                $.each(db, function (index, value) {
                    //if(value.source_name=='DustBoy'){
                        var marker = {};
                        var number_title,color_marker,title_en,title,dustboy_icon,chk_safety;
                        //////////////////////////////////////////////////////////////
                        chk_safety = 0;
                        number_title = Math.floor(parseFloat(value.pm25));
                        color_marker = value.th_color;
                        title_en = value.th_title_en;
                        title = value.th_title;
                        dustboy_icon = value.th_dustboy_icon;
                        //////////////////////////////////////////////////////////////
                        marker = L.marker([value.dustboy_lat, value.dustboy_lon], {
                            icon: L.divIcon({
                                className: "custom_marker",
                                iconSize: [35, 35], 
                                iconAnchor: [0, 0],
                                labelAnchor: [-6, 0],
                                popupAnchor: [17, 0],
                                html: '<div class="custom_marker slit_in_vertical anime_delay075" style="background-color:rgba(' + color_marker + ')">' + number_title + '</div>'
                            })
                        }).addTo(map);
                        marker.on('click', function (e) {
                            var lang = Cookies.get("lang_cookie");
                            //time
                            if (lang == 'EN') {
                                moment.locale('en');
                                var time_date = moment(value.log_datetime).format('ll');
                                var time_time = moment(value.log_datetime).format('LT');
                            } else {
                                moment.locale('th');
                                var time_date = moment(value.log_datetime).format('ll');
                                var time_time = moment(value.log_datetime).format('LT') + ' น.';
                            }
                            // $('.time').html('<i class="far fa-calendar-alt"></i> ' + time_date + ' | <i class="far fa-clock"></i> ' + time_time);
                            // data-toggle="modal" data-target="#exampleModal"
                            $('.prophecy').html('<a class="float-left" onclick="chart_forcast('+value.id+',\'us\',\''+ value.dustboy_name +'\');" style="color:#fff;"><i class="fas fa-cloud-sun"></i></a>');
                            $('.time').html('<span class=""><i class="far fa-calendar-alt"></i> ' + time_date + ' | <i class="far fa-clock"></i> ' + time_time +'</span>');
                            $('.info').html('<a class="float-right ml-2" href="https://www.cmuccdc.org/summaryreport/'+ value.id +'" style="color:#fff;" target="_blank"><i class="fas fa-table"></i></a> <a class="float-right" href="https://www.cmuccdc.org/'+ value.dustboy_uri +'" style="color:#fff;" target="_blank"><i class="fas fa-info-circle"></i></a>');
                            //lang
                            if (lang == 'EN') {
                                $('#popupDetail .card-header p').html(value.dustboy_name_en);
                                $('#popupDetail .detail_title').html(title_en);
                            } else {
                                $('#popupDetail .card-header p').html(value.dustboy_name);
                                $('#popupDetail .detail_title').html(title);
                            }
                            //info-nomal
                            $('#popupDetail .number_title').html(number_title);
                            $('#popupDetail .number_footer').html('μg/m<sup>3</sup>');
                            $('#popupDetail .card-header').css("background-color", "rgba(" + color_marker + ")");
                            $('#popupDetail .card-body').css("background-color", "rgba(" + color_marker + ")");
                            $('#popupDetail .card-footer').css("background-color", "rgba(" + color_marker + ")");
                            // if (category == 'us-hr'||category == 'us-dy') {
                                if(dustboy_icon == 'us-dust-boy-01') dustboy_icon = 'us-dust-boy-01';
                                else if(dustboy_icon == 'us-dust-boy-02') dustboy_icon = 'us-dust-boy-02';
                                else if(dustboy_icon == 'us-dust-boy-03') dustboy_icon = 'us-dust-boy-03';
                                else if(dustboy_icon == 'us-dust-boy-04') dustboy_icon = 'us-dust-boy-04';
                                else if(dustboy_icon == 'us-dust-boy-05') dustboy_icon = 'us-dust-boy-05';
                                else if(dustboy_icon == 'us-dust-boy-06') dustboy_icon = 'us-dust-boy-06';
                            // }else if(category == 'th-hr'||category == 'th-dy'){
                            //     if(marker_icon == 'th-dust-boy-01') marker_icon = 'th-dust-boy-01.8da76418';
                            //     else if(marker_icon == 'th-dust-boy-02') marker_icon = 'th-dust-boy-02.79cc61b5';
                            //     else if(marker_icon == 'th-dust-boy-03') marker_icon = 'th-dust-boy-03.3c43a928';
                            //     else if(marker_icon == 'th-dust-boy-04') marker_icon = 'th-dust-boy-04.db9e51ae';
                            //     else if(marker_icon == 'th-dust-boy-05') marker_icon = 'th-dust-boy-05.363a1424';
                            // }
                            $('#popupDetail .card-body .anime img').attr("src", 'https://dev2.cmuccdc.org/template/image/' + dustboy_icon + '.svg');
                            // $('#popupDetail .card-body .anime img').attr("src", 'https://pm2_5.nrct.go.th/img/' + dustboy_icon + '.svg');
                            $('#popupDetail').show();
                        });
                        //category
                        $('.aqi .dropdown-item').on('click', function (e) {
                            var category = $(this).attr('data-index');
                                var number_title,footeraqi;
                                //hr/dy
                                if(category == 'th-hr'|| category == 'us-hr'){
                                    number_title = Math.floor(parseFloat(value.pm25));
                                    footer25 = value.pm25;
                                }else{
                                    number_title = Math.floor(parseFloat(value.daily_pm25));
                                    footer25 = value.daily_pm25;
                                    if(category == 'th-dy') footeraqi = value.daily_pm25_th_aqi;
                                    else footeraqi = value.daily_pm25_us_aqi;
                                }
                                var marker_color,marker_icon,forecast_aqi;
                                if (category == 'th-hr') {
                                    marker_color = value.th_color;
                                    marker_icon  = value.th_dustboy_icon
                                    forecast_aqi = 'th'
                                } else if (category == 'th-dy'){
                                    marker_color = value.daily_th_color;
                                    marker_icon  = value.daily_th_dustboy_icon
                                    forecast_aqi = 'th'
                                } else if (category == 'us-hr'){
                                    marker_color = value.us_color;
                                    marker_icon  = value.us_dustboy_icon
                                    forecast_aqi = 'us'
                                } else if (category == 'us-dy'){
                                    marker_color = value.daily_us_color;
                                    marker_icon  = value.daily_us_dustboy_icon
                                    forecast_aqi = 'us'
                                }
                                map.removeLayer(marker);
                                if(category=='th-hr'||category=='us-hr')
                                {
                                    marker = L.marker([value.dustboy_lat, value.dustboy_lon], {
                                        icon: L.divIcon({
                                            className: "custom_marker",
                                            iconSize: [35, 35],
                                            iconAnchor: [0, 0],
                                            labelAnchor: [-6, 0],
                                            popupAnchor: [17, 0],
                                            html: '<div class="custom_marker slit_in_vertical" style="background-color:rgba(' + marker_color + ')">' + number_title + '</div>'
                                        })
                                    }).addTo(map);
                                }
                                else if(category=='th-dy'||category=='us-dy')
                                {
                                    if(value.source_name == 'DustBoy')
                                    {
                                        marker = L.marker([value.dustboy_lat, value.dustboy_lon], {
                                            icon: L.divIcon({
                                                className: "custom_marker",
                                                iconSize: [35, 35],
                                                iconAnchor: [0, 0],
                                                labelAnchor: [-6, 0],
                                                popupAnchor: [17, 0],
                                                html: '<div class="custom_marker slit_in_vertical" style="background-color:rgba(' + marker_color + ')">' + number_title + '</div>'
                                            })
                                        }).addTo(map);
                                    }
                                }
                                marker.on('click', function (e) {
                                    var lang = Cookies.get("lang_cookie");
                                    //pm2.5/TH AQI
                                    var lang = Cookies.get("lang_cookie");
                                    if (lang == 'EN') {
                                        moment.locale('en');
                                        var time_date = moment(value.log_datetime).format('ll');
                                        var time_time = moment(value.log_datetime).format('LT');
                                    } else {
                                        moment.locale('th');
                                        var time_date = moment(value.log_datetime).format('ll');
                                        var time_time = moment(value.log_datetime).format('LT') + ' น.';
                                    }
                                    // $('.time').html('<i class="far fa-calendar-alt"></i> ' + time_date + ' | <i class="far fa-clock"></i> ' + time_time);
                                    $('.prophecy').html('<a class="float-left" onclick="chart_forcast('+value.id+',\''+forecast_aqi+'\',\''+ value.dustboy_name +'\');" style="color:#fff;"><i class="fas fa-cloud-sun"></i></a>');
                                    $('.time').html('<span class=""><i class="far fa-calendar-alt"></i> ' + time_date + ' | <i class="far fa-clock"></i> ' + time_time +'</span>');
                                    $('.info').html('<a class="float-right" href="https://www.cmuccdc.org/'+ value.dustboy_uri +'" style="color:#fff;" target="_blank"><i class="fas fa-info-circle"></i></a>');
                                    //pm2.5/US AQI
                                    if (lang == 'EN') {
                                        $('#popupDetail .card-header p').html(value.dustboy_name_en);
                                        if (category == 'th-hr') {
                                            $('#popupDetail .detail_title').html(value.th_title_en);
                                        }else if (category == 'th-dy'){
                                            $('#popupDetail .detail_title').html(value.daily_th_title_en);
                                        }else if (category == 'us-hr'){
                                            $('#popupDetail .detail_title').html(value.us_title_en);
                                        }else if (category == 'us-dy'){
                                            $('#popupDetail .detail_title').html(value.daily_us_title_en);
                                        }
                                    } else {
                                        $('#popupDetail .card-header p').html(value.dustboy_name);
                                        if (category == 'th-hr') {
                                            $('#popupDetail .detail_title').html(value.th_title);
                                        }else if (category == 'th-dy'){
                                            $('#popupDetail .detail_title').html(value.daily_th_title);
                                        }else if (category == 'us-hr'){
                                            $('#popupDetail .detail_title').html(value.us_title);
                                        }else if (category == 'us-dy'){
                                            $('#popupDetail .detail_title').html(value.daily_us_title);
                                        }
                                    }
                                    $('#popupDetail .number_title').html(number_title);
                                    $('#popupDetail .number_footer').html('μg/m<sup>3</sup>');
                                    $('#popupDetail .card-header').css("background-color", "rgba(" + marker_color + ")");
                                    $('#popupDetail .card-body').css("background-color", "rgba(" + marker_color + ")");
                                    $('#popupDetail .card-footer').css("background-color", "rgba(" + marker_color + ")");
                                    if (category == 'us-hr'||category == 'us-dy') {
                                        if(marker_icon == 'us-dust-boy-01') marker_icon = 'us-dust-boy-01';
                                        else if(marker_icon == 'us-dust-boy-02') marker_icon = 'us-dust-boy-02';
                                        else if(marker_icon == 'us-dust-boy-03') marker_icon = 'us-dust-boy-03';
                                        else if(marker_icon == 'us-dust-boy-04') marker_icon = 'us-dust-boy-04';
                                        else if(marker_icon == 'us-dust-boy-05') marker_icon = 'us-dust-boy-05';
                                        else if(marker_icon == 'us-dust-boy-06') marker_icon = 'us-dust-boy-06';
                                    }else if(category == 'th-hr'||category == 'th-dy'){
                                        if(marker_icon == 'th-dust-boy-01') marker_icon = 'th-dust-boy-01';
                                        else if(marker_icon == 'th-dust-boy-02') marker_icon = 'th-dust-boy-02';
                                        else if(marker_icon == 'th-dust-boy-03') marker_icon = 'th-dust-boy-03';
                                        else if(marker_icon == 'th-dust-boy-04') marker_icon = 'th-dust-boy-04';
                                        else if(marker_icon == 'th-dust-boy-05') marker_icon = 'th-dust-boy-05';
                                    }
                                    $('#popupDetail .card-body .anime img').attr("src", 'https://dev2.cmuccdc.org/template/image/' + marker_icon + '.svg');
                                    // $('#popupDetail .card-body .anime img').attr("src", 'https://pm2_5.nrct.go.th/img/' + marker_icon + '.svg');
                                    if(category == 'th-dy'|| category == 'us-dy'){
                                        $('#popupDetail .card-footer .foot_aqi').html("PM<sub>2.5</sub> AQI " + footeraqi);
                                        $('#popupDetail .card-footer .foot_aqi').show();
                                    }else{
                                        $('#popupDetail .card-footer .foot_aqi').hide();
                                    }
                                    $('#popupDetail').show();
                                });
                        });
                   // }
                });
                $('.aqi .dropdown-toggle.disabled').removeClass('disabled');
            }
        });
        //////////////////////////////////////////////////////////////////////////////////////////////////////////
        $('[data-toggle="tooltip"]').tooltip();
        // polygon map
        var geo = L.geoJson({
            features: []
        }).addTo(map);
        var shp_map = 'assets/map/shp2.zip';
        shp(shp_map).then(function (data) {
            geo.addData(data);
        });
    }
});

function chart_forcast(id,aqi,name)
{
    moment.locale('th'); 
    fetch('https://www-old.cmuccdc.org/api2/dustboy/forecast/'+id).then(function (response) {return response.json();})
    .then(function (data) {
        $('.card_title').html('พยากรณ์ค่าฝุ่น PM<sub>2.5</sub><br><small>'+name+'</small>');
        $('.col_forecast').html('');
        const data_forcast=[],label_forcast=[],color_forcast=[];
        var index_data=0;
        if(data.forecast_days.length != 0){
            $.each(data.forecast_days, function (i, value1) { 
                if(i>0&&value1.length != 0){
                    var html = '<div class="card_forecast card_forecast_'+(i)+' card shadow"><div class="title row m-0"><div class="col-3 d-flex justify-content-end align-items-center"><img class="anime_forecast anime_forecast_'+(i)+' shadow-drop-bottom" alt="pm2.5_icon" src=""></div><div class="col-9 d-flex flex-column justify-content-center align-items-center"><div class="date_forecast date_forecast_'+(i)+'"></div><div class="pm25_forecast pm25_forecast_'+(i)+'"></div></div></div><div class="chart"><canvas id="chart_forcast_'+(i)+'" class="px-1"></canvas></div></div>';
                    $('.col_forecast').append(html);
                    if(aqi == 'us'){
                        if(value1.day_us_icon == 'us-dust-boy-01') dustboy_icon = 'us-dust-boy-01.5c5fb4bc';
                        else if(value1.day_us_icon == 'us-dust-boy-02') dustboy_icon = 'us-dust-boy-02.4fc5182a';
                        else if(value1.day_us_icon == 'us-dust-boy-03') dustboy_icon = 'us-dust-boy-03.690e1925';
                        else if(value1.day_us_icon == 'us-dust-boy-04') dustboy_icon = 'us-dust-boy-04.2aa99ce2';
                        else if(value1.day_us_icon == 'us-dust-boy-05') dustboy_icon = 'us-dust-boy-05.ab92ca6b';
                        else if(value1.day_us_icon == 'us-dust-boy-06') dustboy_icon = 'us-dust-boy-06.c4b42d56';
                        color = value1.day_us_color;
                    }else{
                        if(value1.day_th_icon == 'th-dust-boy-01') dustboy_icon = 'th-dust-boy-01.8da76418';
                        else if(value1.day_th_icon == 'th-dust-boy-02') dustboy_icon = 'th-dust-boy-02.79cc61b5';
                        else if(value1.day_th_icon == 'th-dust-boy-03') dustboy_icon = 'th-dust-boy-03.3c43a928';
                        else if(value1.day_th_icon == 'th-dust-boy-04') dustboy_icon = 'th-dust-boy-04.db9e51ae';
                        else if(value1.day_th_icon == 'th-dust-boy-05') dustboy_icon = 'th-dust-boy-05.363a1424';
                        color = value1.day_th_color;
                    }
                    $('.anime_forecast_'+(i)).attr('src','https://pm2_5.nrct.go.th/img/'+ dustboy_icon +'.svg');
                    // $('.card_forecast_'+(i+1)).css("background-color", "rgba(" + color + ",0.75)");
                    $('.date_forecast_'+(i)).html('วัน'+moment(value1.day_date).format('ddd'));
                    $('.pm25_forecast_'+(i)).html("PM<sub>2.5</sub> เฉลี่ย : <b>"+value1.day_avg_pm25+"</b> <small>(μg/m3)</small>");
                    data_forcast[i] = [],label_forcast[i] = [],color_forcast[i] = [];
                    $.each(value1.forecast_hours, function (j, value2) { 
                        data_forcast[i][j] = value2.hour_avg_pm25;
                        label_forcast[i][j] = value2.time;
                        color_forcast[i][j] = aqi=='us'?'rgb('+ value2.hour_us_color +')':'rgb('+ value2.hour_th_color +')'; 
                    });
                    index_data++;
                }
            });
            $('#prophecy-modal').modal('show');
            var chart_forecast = [];
            setTimeout(() => {
                for (let index = 1; index <= index_data; index++) {
                    chart_forecast[index-1] = new Chart('chart_forcast_'+index, {
                        type: 'bar',
                        data: {
                            labels: label_forcast[index],
                            datasets: [{
                                label: 'PM2.5',
                                backgroundColor: color_forcast[index],
                                borderColor: color_forcast[index],
                                data: data_forcast[index]
                            }]
                        },
                        options: ({
                            scales: {
                                xAxes: [{
                                    ticks: {
                                        beginAtZero: true, 
                                        fontFamily: "'kanit', sans-serif"
                                    },
                                    gridLines: {
                                        color: "rgba(0, 0, 0, 0)",
                                    }
                                }],
                                yAxes: [{
                                    ticks: {
                                        beginAtZero: true, 
                                        fontFamily: "'kanit', sans-serif",
                                    },
                                    gridLines: {
                                        color: "rgba(0, 0, 0, 0)",
                                    }
                                }]  
                            },
                            elements: {
                                line: {
                                    tension: 0.4
                                }
                            },
                            legend: {
                                display: false
                            },
                            tooltips: {
                                callbacks: {
                                    label: function(tooltipItem) {
                                            return tooltipItem.yLabel;
                                    }
                                }
                            }
                        })
                    });
                }
            }, 500);
        }
    });
}
