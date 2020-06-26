import { Component, OnInit, OnChanges, SimpleChanges, SimpleChange, ViewChild, ElementRef, Input } from '@angular/core';
import { NgbModal, NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import * as moment from "moment";

//services
import { WiseconnService } from 'app/services/wiseconn.service';
import { Variable } from '@angular/compiler/src/render3/r3_ast';
//graficas
// tslint:disable-next-line:no-var-requires
const Highcharts = require('highcharts/highstock');
// tslint:disable-next-line:no-var-requires
require('highcharts/highmaps');
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/solid-gauge')(Highcharts);
require('highcharts/highcharts-more')(Highcharts);

@Component({
	selector: 'app-chart',
	templateUrl: './chart.component.html',
	styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit,OnChanges {
	@Input() weatherStation:any;
	@Input() title:string;
	@Input() type:string;
	@Input() firstSensorType:string='';
	@Input() secondSensorType:string='';
	@Input() NameY1:string;
	@Input() NameY2:string;
	public firstId: number = null;
	public secondId: number = null;
	public loading:boolean=false;
	//graficas
	//rango de fechas para graficas
	@Input() fromDate:any;
	@Input() toDate:any;
	public dateRange: any = null;
	public dateRangeHistory:any[]=[];
	public selectedValue: any = '1S';
	public requestChartBtn: boolean =true;
	//chart
	@ViewChild('chart', { static: true }) public chartElement: ElementRef;
	private chart;
	public chartData:any[]=[[],[]];
	public dataPrueba = [
		[
			1528119000000,
			191.83
		],
		[
			1528205400000,
			193.31
		],
		[
			1528291800000,
			193.98
		],
		[
			1528378200000,
			193.46
		],
		[
			1528464600000,
			191.7
		],
		[
			1528723800000,
			191.23
		],
		[
			1528810200000,
			192.28
		],
		[
			1528896600000,
			190.7
		],
		[
			1528983000000,
			190.8
		],
		[
			1529069400000,
			188.84
		],
		[
			1529328600000,
			188.74
		],
		[
			1529415000000,
			185.69
		],
		[
			1529501400000,
			186.5
		],
		[
			1529587800000,
			185.46
		],
		[
			1529674200000,
			184.92
		],
		[
			1529933400000,
			182.17
		],
		[
			1530019800000,
			184.43
		],
		[
			1530106200000,
			184.16
		],
		[
			1530192600000,
			185.5
		],
		[
			1530279000000,
			185.11
		],
		[
			1530538200000,
			187.18
		],
		[
			1530624600000,
			183.92
		],
		[
			1530797400000,
			185.4
		],
		[
			1530883800000,
			187.97
		],
		[
			1531143000000,
			190.58
		],
		[
			1531229400000,
			190.35
		],
		[
			1531315800000,
			187.88
		],
		[
			1531402200000,
			191.03
		],
		[
			1531488600000,
			191.33
		],
		[
			1531747800000,
			190.91
		],
		[
			1531834200000,
			191.45
		],
		[
			1531920600000,
			190.4
		],
		[
			1532007000000,
			191.88
		],
		[
			1532093400000,
			191.44
		],
		[
			1532352600000,
			191.61
		],
		[
			1532439000000,
			193
		],
		[
			1532525400000,
			194.82
		],
		[
			1532611800000,
			194.21
		],
		[
			1532698200000,
			190.98
		],
		[
			1532957400000,
			189.91
		],
		[
			1533043800000,
			190.29
		],
		[
			1533130200000,
			201.5
		],
		[
			1533216600000,
			207.39
		],
		[
			1533303000000,
			207.99
		],
		[
			1533562200000,
			209.07
		],
		[
			1533648600000,
			207.11
		],
		[
			1533735000000,
			207.25
		],
		[
			1533821400000,
			208.88
		],
		[
			1533907800000,
			207.53
		],
		[
			1534167000000,
			208.87
		],
		[
			1534253400000,
			209.75
		],
		[
			1534339800000,
			210.24
		],
		[
			1534426200000,
			213.32
		],
		[
			1534512600000,
			217.58
		],
		[
			1534771800000,
			215.46
		],
		[
			1534858200000,
			215.04
		],
		[
			1534944600000,
			215.05
		],
		[
			1535031000000,
			215.49
		],
		[
			1535117400000,
			216.16
		],
		[
			1535376600000,
			217.94
		],
		[
			1535463000000,
			219.7
		],
		[
			1535549400000,
			222.98
		],
		[
			1535635800000,
			225.03
		],
		[
			1535722200000,
			227.63
		],
		[
			1536067800000,
			228.36
		],
		[
			1536154200000,
			226.87
		],
		[
			1536240600000,
			223.1
		],
		[
			1536327000000,
			221.3
		],
		[
			1536586200000,
			218.33
		],
		[
			1536672600000,
			223.85
		],
		[
			1536759000000,
			221.07
		],
		[
			1536845400000,
			226.41
		],
		[
			1536931800000,
			223.84
		],
		[
			1537191000000,
			217.88
		],
		[
			1537277400000,
			218.24
		],
		[
			1537363800000,
			218.37
		],
		[
			1537450200000,
			220.03
		],
		[
			1537536600000,
			217.66
		],
		[
			1537795800000,
			220.79
		],
		[
			1537882200000,
			222.19
		],
		[
			1537968600000,
			220.42
		],
		[
			1538055000000,
			224.95
		],
		[
			1538141400000,
			225.74
		],
		[
			1538400600000,
			227.26
		],
		[
			1538487000000,
			229.28
		],
		[
			1538573400000,
			232.07
		],
		[
			1538659800000,
			227.99
		],
		[
			1538746200000,
			224.29
		],
		[
			1539005400000,
			223.77
		],
		[
			1539091800000,
			226.87
		],
		[
			1539178200000,
			216.36
		],
		[
			1539264600000,
			214.45
		],
		[
			1539351000000,
			222.11
		],
		[
			1539610200000,
			217.36
		],
		[
			1539696600000,
			222.15
		],
		[
			1539783000000,
			221.19
		],
		[
			1539869400000,
			216.02
		],
		[
			1539955800000,
			219.31
		],
		[
			1540215000000,
			220.65
		],
		[
			1540301400000,
			222.73
		],
		[
			1540387800000,
			215.09
		],
		[
			1540474200000,
			219.8
		],
		[
			1540560600000,
			216.3
		],
		[
			1540819800000,
			212.24
		],
		[
			1540906200000,
			213.3
		],
		[
			1540992600000,
			218.86
		],
		[
			1541079000000,
			222.22
		],
		[
			1541165400000,
			207.48
		],
		[
			1541428200000,
			201.59
		],
		[
			1541514600000,
			203.77
		],
		[
			1541601000000,
			209.95
		],
		[
			1541687400000,
			208.49
		],
		[
			1541773800000,
			204.47
		],
		[
			1542033000000,
			194.17
		],
		[
			1542119400000,
			192.23
		],
		[
			1542205800000,
			186.8
		],
		[
			1542292200000,
			191.41
		],
		[
			1542378600000,
			193.53
		],
		[
			1542637800000,
			185.86
		],
		[
			1542724200000,
			176.98
		],
		[
			1542810600000,
			176.78
		],
		[
			1542983400000,
			172.29
		],
		[
			1543242600000,
			174.62
		],
		[
			1543329000000,
			174.24
		],
		[
			1543415400000,
			180.94
		],
		[
			1543501800000,
			179.55
		],
		[
			1543588200000,
			178.58
		],
		[
			1543847400000,
			184.82
		],
		[
			1543933800000,
			176.69
		],
		[
			1544106600000,
			174.72
		],
		[
			1544193000000,
			168.49
		],
		[
			1544452200000,
			169.6
		],
		[
			1544538600000,
			168.63
		],
		[
			1544625000000,
			169.1
		],
		[
			1544711400000,
			170.95
		],
		[
			1544797800000,
			165.48
		],
		[
			1545057000000,
			163.94
		],
		[
			1545143400000,
			166.07
		],
		[
			1545229800000,
			160.89
		],
		[
			1545316200000,
			156.83
		],
		[
			1545402600000,
			150.73
		],
		[
			1545661800000,
			146.83
		],
		[
			1545834600000,
			157.17
		],
		[
			1545921000000,
			156.15
		],
		[
			1546007400000,
			156.23
		],
		[
			1546266600000,
			157.74
		],
		[
			1546439400000,
			157.92
		],
		[
			1546525800000,
			142.19
		],
		[
			1546612200000,
			148.26
		],
		[
			1546871400000,
			147.93
		],
		[
			1546957800000,
			150.75
		],
		[
			1547044200000,
			153.31
		],
		[
			1547130600000,
			153.8
		],
		[
			1547217000000,
			152.29
		],
		[
			1547476200000,
			150
		],
		[
			1547562600000,
			153.07
		],
		[
			1547649000000,
			154.94
		],
		[
			1547735400000,
			155.86
		],
		[
			1547821800000,
			156.82
		],
		[
			1548167400000,
			153.3
		],
		[
			1548253800000,
			153.92
		],
		[
			1548340200000,
			152.7
		],
		[
			1548426600000,
			157.76
		],
		[
			1548685800000,
			156.3
		],
		[
			1548772200000,
			154.68
		],
		[
			1548858600000,
			165.25
		],
		[
			1548945000000,
			166.44
		],
		[
			1549031400000,
			166.52
		],
		[
			1549290600000,
			171.25
		],
		[
			1549377000000,
			174.18
		],
		[
			1549463400000,
			174.24
		],
		[
			1549549800000,
			170.94
		],
		[
			1549636200000,
			170.41
		],
		[
			1549895400000,
			169.43
		],
		[
			1549981800000,
			170.89
		],
		[
			1550068200000,
			170.18
		],
		[
			1550154600000,
			170.8
		],
		[
			1550241000000,
			170.42
		],
		[
			1550586600000,
			170.93
		],
		[
			1550673000000,
			172.03
		],
		[
			1550759400000,
			171.06
		],
		[
			1550845800000,
			172.97
		],
		[
			1551105000000,
			174.23
		],
		[
			1551191400000,
			174.33
		],
		[
			1551277800000,
			174.87
		],
		[
			1551364200000,
			173.15
		],
		[
			1551450600000,
			174.97
		],
		[
			1551709800000,
			175.85
		],
		[
			1551796200000,
			175.53
		],
		[
			1551882600000,
			174.52
		],
		[
			1551969000000,
			172.5
		],
		[
			1552055400000,
			172.91
		],
		[
			1552311000000,
			178.9
		],
		[
			1552397400000,
			180.91
		],
		[
			1552483800000,
			181.71
		],
		[
			1552570200000,
			183.73
		],
		[
			1552656600000,
			186.12
		],
		[
			1552915800000,
			188.02
		],
		[
			1553002200000,
			186.53
		],
		[
			1553088600000,
			188.16
		],
		[
			1553175000000,
			195.09
		],
		[
			1553261400000,
			191.05
		],
		[
			1553520600000,
			188.74
		],
		[
			1553607000000,
			186.79
		],
		[
			1553693400000,
			188.47
		],
		[
			1553779800000,
			188.72
		],
		[
			1553866200000,
			189.95
		],
		[
			1554125400000,
			191.24
		],
		[
			1554211800000,
			194.02
		],
		[
			1554298200000,
			195.35
		],
		[
			1554384600000,
			195.69
		],
		[
			1554471000000,
			197
		],
		[
			1554730200000,
			200.1
		],
		[
			1554816600000,
			199.5
		],
		[
			1554903000000,
			200.62
		],
		[
			1554989400000,
			198.95
		],
		[
			1555075800000,
			198.87
		],
		[
			1555335000000,
			199.23
		],
		[
			1555421400000,
			199.25
		],
		[
			1555507800000,
			203.13
		],
		[
			1555594200000,
			203.86
		],
		[
			1555939800000,
			204.53
		],
		[
			1556026200000,
			207.48
		],
		[
			1556112600000,
			207.16
		],
		[
			1556199000000,
			205.28
		],
		[
			1556285400000,
			204.3
		],
		[
			1556544600000,
			204.61
		],
		[
			1556631000000,
			200.67
		],
		[
			1556717400000,
			210.52
		],
		[
			1556803800000,
			209.15
		],
		[
			1556890200000,
			211.75
		],
		[
			1557149400000,
			208.48
		],
		[
			1557235800000,
			202.86
		],
		[
			1557322200000,
			202.9
		],
		[
			1557408600000,
			200.72
		],
		[
			1557495000000,
			197.18
		],
		[
			1557754200000,
			185.72
		],
		[
			1557840600000,
			188.66
		],
		[
			1557927000000,
			190.92
		],
		[
			1558013400000,
			190.08
		],
		[
			1558099800000,
			189
		],
		[
			1558359000000,
			183.09
		],
		[
			1558445400000,
			186.6
		],
		[
			1558531800000,
			182.78
		],
		[
			1558618200000,
			179.66
		],
		[
			1558704600000,
			178.97
		],
		[
			1559050200000,
			178.23
		],
		[
			1559136600000,
			177.38
		],
		[
			1559223000000,
			178.3
		],
		[
			1559309400000,
			175.07
		],
		[
			1559568600000,
			173.3
		],
		[
			1559655000000,
			179.64
		],
		[
			1559741400000,
			182.54
		],
		[
			1559827800000,
			185.22
		],
		[
			1559914200000,
			190.15
		],
		[
			1560173400000,
			192.58
		],
		[
			1560259800000,
			194.81
		],
		[
			1560346200000,
			194.19
		],
		[
			1560432600000,
			194.15
		],
		[
			1560519000000,
			192.74
		],
		[
			1560778200000,
			193.89
		],
		[
			1560864600000,
			198.45
		],
		[
			1560951000000,
			197.87
		],
		[
			1561037400000,
			199.46
		],
		[
			1561123800000,
			198.78
		],
		[
			1561383000000,
			198.58
		],
		[
			1561469400000,
			195.57
		],
		[
			1561555800000,
			199.8
		],
		[
			1561642200000,
			199.74
		],
		[
			1561728600000,
			197.92
		],
		[
			1561987800000,
			201.55
		],
		[
			1562074200000,
			202.73
		],
		[
			1562160600000,
			204.41
		],
		[
			1562333400000,
			204.23
		],
		[
			1562592600000,
			200.02
		],
		[
			1562679000000,
			201.24
		],
		[
			1562765400000,
			203.23
		],
		[
			1562851800000,
			201.75
		],
		[
			1562938200000,
			203.3
		],
		[
			1563197400000,
			205.21
		],
		[
			1563283800000,
			204.5
		],
		[
			1563370200000,
			203.35
		],
		[
			1563456600000,
			205.66
		],
		[
			1563543000000,
			202.59
		],
		[
			1563802200000,
			207.22
		],
		[
			1563888600000,
			208.84
		],
		[
			1563975000000,
			208.67
		],
		[
			1564061400000,
			207.02
		],
		[
			1564147800000,
			207.74
		],
		[
			1564407000000,
			209.68
		],
		[
			1564493400000,
			208.78
		],
		[
			1564579800000,
			213.04
		],
		[
			1564666200000,
			208.43
		],
		[
			1564752600000,
			204.02
		],
		[
			1565011800000,
			193.34
		],
		[
			1565098200000,
			197
		],
		[
			1565184600000,
			199.04
		],
		[
			1565271000000,
			203.43
		],
		[
			1565357400000,
			200.99
		],
		[
			1565616600000,
			200.48
		],
		[
			1565703000000,
			208.97
		],
		[
			1565789400000,
			202.75
		],
		[
			1565875800000,
			201.74
		],
		[
			1565962200000,
			206.5
		],
		[
			1566221400000,
			210.35
		],
		[
			1566307800000,
			210.36
		],
		[
			1566394200000,
			212.64
		],
		[
			1566480600000,
			212.46
		],
		[
			1566567000000,
			202.64
		],
		[
			1566826200000,
			206.49
		],
		[
			1566912600000,
			204.16
		],
		[
			1566999000000,
			205.53
		],
	];

	public chartLabels:any={
		values:[],
		labels:[]
	};
	public chartOptions:any = {
		chart: {
			zoomType: 'xy'
		},
		colors: [],
		title: {
			text: ''
		},
		subtitle: {
			text: null
		},
		xAxis: {			
			type: 'datetime', 
			id:'x0',
			startOnTick: false,
			endOnTick: false,
			tickLength: 0,
			labels : {
				style: {
		    		"font-family": 'Tahoma,"Trebuchet MS",sans-serif',
		    		"font-size": '11px',
		    		"textOverflow": "none"
				},
				autoRotation: false,
				padding: 0
			}
			
		},	
		yAxis: [{ // Primary yAxis
			labels: {
				format: '{value}',
				style: {
					color: ''
				}
			
			},
			title: {
				text: '',
				style: {
					color: ''
				}
			
			}
		}, { // Secondary yAxis
			title: {
				text: '',
				style: {
					color: ''
				}
				
			},
			labels: {
				format: '{value} ',
				style: {
					color: ''
				}
			
			},
			opposite: true
		}],
		plotOptions: {
			line: {
				dataLabels: {
					enabled: false
				},
				enableMouseTracking: true,
			}
		},
		series: [],
		tooltip: {
			shared: true,
			crosshairs: true,
			xDateFormat: '%Y-%m-%d %H:%M:%S'
		},
	};
	//colors
	/*
	et0:#b5b5b5,
	precipitación:#0069b3,
	riego:#ed69a3,
	radiación:#ffd237,
	temperatura:#d12b34,
	humedad relativa:#00b9ee,
	velocidad de viento:#905ba7,
	direccion de viento:#95c11f
	*/
	public renderchartFlag: boolean = false;
	constructor(
		private calendar: NgbCalendar,
		private wiseconnService: WiseconnService, 
		) { }

	ngOnInit(){    
		this.chartOptions.title.text=this.title;
		this.chartOptions.title.type=this.type;
		switch (this.title) {
			case "TEMPERATURA/HUMEDAD":
				this.chartOptions.colors=['#d12b34','#00b9ee'];
				this.chartOptions.yAxis[0].title.text='Temperatura';
				this.chartOptions.yAxis[0].title.style.color='#d12b34';
				this.chartOptions.yAxis[0].labels.style.color='#666666';
				this.chartOptions.yAxis[1].title.text='Humedad';		
				this.chartOptions.yAxis[1].title.style.color='#00b9ee';		;
				this.chartOptions.yAxis[1].labels.style.color='#666666';
				this.chartOptions.chart.type=this.type;
				this.chartOptions.series=[{ 
					data: [],  
					name: 'Temperatura',
					type: 'line',
					 yAxis: 0 
				},{ 
					data: [], 
					name: 'Humedad',
					type: 'line', 
					yAxis: 1 
				}]
				break;
			case "PRECIPITACIÓN/ET0":
				this.chartOptions.colors=['#0069b3','#b5b5b5'];
				this.chartOptions.yAxis[0].title.text='Precipitación';
				this.chartOptions.yAxis[0].title.style.color='#0069b3';
				this.chartOptions.yAxis[0].labels.style.color='#666666';
				this.chartOptions.yAxis[1].title.text='ET0';
				this.chartOptions.yAxis[1].title.style.color='#b5b5b5';
				this.chartOptions.yAxis[1].labels.style.color='#666666';
				this.chartOptions.series=[{
					type: 'column',
					name: 'Precipitación (mm)', 
					data: [],
					yAxis: 0  
				},{
					type: 'column',
					name: 'Et0 (mm)', 
					data: [],
					yAxis: 1  
				}]
				break;
			case "PORCIONES FRIOS/PORCIONES FRIOS":
				this.chartOptions.colors=['#d12b34','#00b9ee'];
				this.chartOptions.yAxis[0].title.text='PORCIONES FRIOS';
				this.chartOptions.yAxis[1].title.style.color='#d12b34';
				this.chartOptions.yAxis[0].labels.style.color='#666666';
				this.chartOptions.yAxis[1].title.text='';
				this.chartOptions.yAxis[1].title.style.color='#00b9ee';
				this.chartOptions.yAxis[1].labels.style.color='#666666';
				this.chartOptions.series=[{
					type: undefined,
					name: 'PORCIONES FRIOS', 
					data: [] 
				},{
					type: undefined,
					name: 'PORCIONES FRIOS', 
					data: [] 
				}]
				break;
			case "RADIACIÓN/VELOCIDAD DEL VIENTO":
				this.chartOptions.colors=['#ffd237','#905ba7'];
				this.chartOptions.yAxis[0].title.text='Radiacion';
				this.chartOptions.yAxis[0].title.style.color='#ffd237';
				this.chartOptions.yAxis[0].labels.style.color='#666666';
				this.chartOptions.yAxis[1].title.text='Viento';
				this.chartOptions.yAxis[1].title.style.color='#905ba7';
				this.chartOptions.yAxis[1].labels.style.color='#666666';
				this.chartOptions.series=[{
					type: undefined,
					name: 'RADIACIÓN', 
					data: [] 
				},{
					type: undefined,
					name: 'VIENTO', 
					data: [] 
				}]
				break;
			default:
			// code...
			break;
		}
		this.highchartsShow();
	}
	ngOnChanges(changes: SimpleChanges) {
	/*	if(changes.weatherStation!=undefined){
			const weatherStationCurrentValue: SimpleChange = changes.weatherStation.currentValue;
			this.weatherStation=weatherStationCurrentValue;
		}
		if(changes.fromDate!=undefined&&changes.toDate!=undefined){
			const fromDateCurrentValue: SimpleChange = changes.fromDate.currentValue;
			const toDateCurrentValue: SimpleChange = changes.toDate.currentValue;
			this.fromDate = fromDateCurrentValue;
			this.toDate = toDateCurrentValue;
		}*/
		if(this.weatherStation&&this.fromDate&&this.toDate){
			this.getChartInformation(false);			
		}
	}
	highchartsShow(){
		this.chartOptions.chart['renderTo'] = this.chartElement.nativeElement;
		this.chart = Highcharts.chart(this.chartOptions);
	}
	renderCharts() {
		for (var i = this.chart.series.length - 1; i >= 0; i--) {		
			this.chart.series[i].setData(this.chartData[i]);
		}
		// this.chart.xAxis[0].setCategories(this.chartLabels.labels, true);
		this.renderchartFlag=true;
	}
	resetChartsValues(){
		this.firstId=null;
		this.secondId=null;
		if(this.chart!=undefined){
			for (var i = this.chart.series.length - 1; i >= 0; i--) {
				this.chart.series[i].setData([]);
			}
			this.chart.xAxis[0].setCategories([]);        
		}
		this.chartLabels.values=[];
		this.chartLabels.labels=[];
		for (var i = 0; i < 2; i++) {
			this.chartData[i]=[];
		}
	}
	momentFormat(value:string,chart:string){
		switch (chart) {
			case "label":
			// return moment.utc(value).format('DD') +" "+ moment.utc(value).format('MMM');
			return moment.utc(value).format("YYYY-MM-DD HH:mm:ss");

			break;
			case "value":
			return moment.utc(value).format("YYYY-MM-DD HH:mm:ss");
			break;
			default:
			return value;
			break;
		}      
	}

	addData(data){
		this.chartData[0]= data[0];
		this.chartData[1]= data[1];
		this.renderCharts(); 
	}
	getChartInformation(goBackFlag:boolean=false){
		// this.resetChartsValues();
		let dataarray = new Array(); 
		if(this.fromDate!=undefined&&this.toDate!=undefined){
			this.dateRange = {
				initTime: moment(this.fromDate.year + "-" + this.fromDate.month + "-" + this.fromDate.day).format("YYYY-MM-DD"),
				endTime: moment(this.toDate.year + "-" + this.toDate.month + "-" + this.toDate.day).format("YYYY-MM-DD")
			};
			if(!goBackFlag){          
				this.dateRangeHistory.push({
					fromDate:this.fromDate,
					toDate:this.toDate,
					selectedValue:this.selectedValue
				});
			}
			this.loading=true;		
			 
			
			this.wiseconnService.getMeasuresOfZones(this.weatherStation.id).subscribe((response) => {
				this.loading=false;
				
				let data=response.data?response.data:response;
				if(data.length>0){
					let chartFlag=false;
					let j=0;
					let htmlErrors=null;
					while (!chartFlag && j < data.length - 1) {
						if (data[j].sensorType === this.firstSensorType||data[j].name==this.firstSensorType) {
							this.firstId = data[j].id;
						}
						if (data[j].sensorType === this.secondSensorType||data[j].name==this.secondSensorType) {
							this.secondId = data[j].id;
						}
						let data2 = 'id0=' + this.firstId + '&' + 'id1=' + this.secondId;
						
						

						if(this.firstId&&this.secondId){
							chartFlag=true;
							this.loading = true;
							this.wiseconnService.getDataByMeasure(this.firstId,this.dateRange, data2).subscribe((response) => {
								let firstChartData = response.data ? response.data : response;
								/*for (var i = 0; i < firstChartData.length ; i++) {
									/*console.log(firstChartData[i][0]);
									console.log(firstChartData[i][1]);
									dataarray.push([firstChartData[i][0], firstChartData[i][1]]);
									
								}*/
								this.addData(firstChartData);
								
								/*this.chartOptions.series[0].data =  this.dataPrueba;

								console.log(this.chartOptions.series);*/
								
								// this.chartData = firstChartData;
								
								
								
		

								 //this.renderCharts();

								/*this.wiseconnService.getDataByMeasure(this.secondId,this.dateRange).subscribe((response) => {
									this.loading = false;
									let secondChartData=response.data?response.data:response;
									// this.loading = false;
									firstChartData=firstChartData.map((element)=>{
										element.chart=this.firstSensorType.toLowerCase();
										return element
									})
									secondChartData=secondChartData.map((element)=>{
										element.chart=this.secondSensorType.toLowerCase();
										return element
									})
									let chartData=firstChartData.concat(secondChartData);
									chartData.sort(function (a, b) {
										if (moment(a.time).isAfter(b.time)) {
											return 1;
										}
										if (!moment(a.time).isAfter(b.time)) {
											return -1;
										}
										// a must be equal to b
										return 0;
									});
									chartData = chartData.filter((element) => {
										let hour=moment(element.time).hours();
										let minutes=moment(element.time).minutes();
										if(hour >= 0 && hour<24 && (minutes==30 || minutes==0))
									
											return element;
									});
									for (var i = 0; i < chartData.length ; i++) {
										if(this.chartLabels.values.find((element) => {return this.momentFormat(element,"value") === this.momentFormat(chartData[i].time,"value");}) === undefined) {
											this.chartLabels.values.push(this.momentFormat(chartData[i].time,"value"));
											this.chartLabels.labels.push(this.momentFormat(chartData[i].time,"label"));
										}
										if((chartData[i].chart===this.firstSensorType.toLowerCase())&&this.chartLabels.values[this.chartLabels.values.length-1]==this.momentFormat(chartData[i].time,"value"))
											this.chartData[0].push(chartData[i].value);
										if((chartData[i].chart===this.secondSensorType.toLowerCase())&&this.chartLabels.values[this.chartLabels.values.length-1]==this.momentFormat(chartData[i].time,"value"))
											this.chartData[1].push(chartData[i].value);
									}
									if(this.chartData[0].length>this.chartData[1].length){
										this.chartData[0]= this.chartData[0].slice(0, this.chartData[1].length);
									}else{
										this.chartData[1]= this.chartData[1].slice(0, this.chartData[0].length);
									}
									this.renderCharts();
								},
								error=>{
									this.loading = false;
									console.log("error:",error)
								});*/
							},
							error=>{
								this.loading = false;
								console.log("error:",error)
							});
						}
						j++;
					}
				}
			},
			error=>{
				this.loading=false;
				console.log("error:",error);
			});
		}
	}

	transformarFecha(fecha) {
		const data = {"date_created":"1590838200000"};
		let date = new Date(parseInt(data.date_created, 10) * 1000);
		return date;
		//return new Date( parseInt(fecha, 10) *1000);
		// return (new Date((fecha - (25567 + 1))*86400*1000)).toLocaleDateString();
	}

}
