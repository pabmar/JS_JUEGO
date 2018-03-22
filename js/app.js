var val = 0;
var intervalo = 0;
var bhorizontal = 0;
var bvertical  = 0;
var min =2;
var seg= 0;
var tiempo = 0;
var eliminarDulce = 0;
var nuevosDulces = 0;
var score = 0;
var mov = 0;
var lencolum = ["","","","","","",""];
var lenrest = ["","","","","","",""];
var buscarNuevoDulce = 0;
var maxi = 0;
var conGen = 0;
var espera = 0;
var mz = 0;

var animacionTitulo = {
   tituloanimado: function(){
    setInterval(function(){
      $(".main-titulo").animate({color: "#DCFF0E"}, 1000),
      $(".main-titulo").animate({color: "#FFFFFF"}, 1000)
    }, 300);
   }
  }
  $(function(){
    animacionTitulo.tituloanimado();
  });

$(".btn-reinicio").click(function(){
  $("#score-text").html("0");
  $("#movimientos-text").html("0");
  $(".time").show();
  $(".panel-score").css("width","25%");
  $(".panel-tablero").show();
  $(this).html('<a href="" class="reinicio">Reiniciar</a>');
  intervalo=setInterval(function(){
    movDulces()
  },600);
  tiempo=setInterval(function(){
    timer()
  },1000)
});

function timer(){
	var cero = '';
	if(seg < 10){
		cero = '0';
	} else {
		cero = '';
	}
	$("#timer").html("0"+min+":"+cero+seg);
	if(seg!=0){
		seg=seg-1;}
	if(seg==0){
		if(min===seg){
		//	clearInterval(eliminarCandy);
	//		clearInterval(nuevosCandy);
			clearInterval(intervalo);
			clearInterval(tiempo);
			$(".panel-tablero").hide("drop","slow",gameOver);
			$(".time").hide();
		}
		seg=59;
		min=min-1;
	}
};

function movDulces(){
	val = val+1
	var numero=0;
	var imagen=0;
	$(".elemento").draggable({disabled:true});
	if(val<8){
		for(var j=1;j<8;j++){
			if($(".col-"+j).children("img:nth-child("+val+")").html()==null){
				numero=Math.floor(Math.random()*4)+1;
				imagen="image/"+numero+".png";
				$(".col-"+j).prepend("<img src="+imagen+" class='elemento'/>").css("justify-content","flex-start")
			}}}
	if(val==8){
		clearInterval(intervalo);
		eliminarCandy=setInterval(function(){
			eliminarFilaColumna()
		},150);
	}
}


function eliminarFilaColumna(){
  mz = 0;
  bhorizontal = validarHorizontal();
  bvertical = validarVertical();
  for (var i = 0; i < 8 ; i++) {
      mz = mz+$(".col-"+i).children().length;
    }
  if(bhorizontal==0 && bvertical==0 && mz!=49){
    clearInterval(eliminarDulce);
    buscarNuevoDulce=0;
    nuevosDulces=setInterval(function(){
          nuevoDulce()
    },600);
  }
  if (bhorizontal==1 || bvertical ==1) {
    $(".elemento").draggable({disabled:true});
    $("div[class^='col']").css("justify-content","flex-end");
    $(".activo").hide("pulsate",1000,function(){
      var scoretmp=$(".activo").length;
      $(".activo").remove("img");
      score=score+scoretmp*100;
      $("#score-text").html(score);
    });
  }
  if(bhorizontal==0 && bvertical == 0 && mz==49){
    $(".elemento").draggable({
 			disabled:false,
 			containment:".panel-tablero",
 			revert:true,
 			revertDuration:0,
 			snap:".elemento",
 			snapMode:"inner",
 			snapTolerance:40,
 			start:function(event,ui){
 				mov=mov+1;
 				$("#movimientos-text").html(mov);}
 		});
  }
  $(".elemento").droppable({
		drop:function (event,ui){
			var dropped=ui.draggable;
			var droppedOn=this;
			 espera=0;
			do{
				espera=dropped.swap($(droppedOn));}
			while(espera==0);
			bhorizontal=horizontal();
			bvertical=vertical();
			if(bhorizontal==0 && bvertical==0){
				dropped.swap($(droppedOn));}
			if(bhorizontal==1 || bvertical==1){
				clearInterval(nuevosDulces);
				clearInterval(eliminarDulce);
				eliminarDulce=setInterval(function(){
					eliminarFilaColumna()
				},200);}},
	});
}


function nuevoDulce(){
  	$(".elemento").draggable({disabled:true});
    $("div[class^='col']").css("justify-content","flex-start")
    for(var j=1;j<8;j++){
      lencolum[j-1]=$(".col-"+j).children().length;
    }
    if(buscarNuevoDulce==0){
      for(var j=0;j<7;j++){
        lenrest[j]=(7-lencolum[j]);}
      maxi=Math.max.apply(null,lenrest);
      conGen=maxi;
    }
    if(maxi!=0){
  		if(buscarNuevoDulce==1){
  			for(var j=1;j<8;j++){
  				if(conGen>(maxi-lenrest[j-1])){
  					$(".col-"+j).children("img:nth-child("+(lenrest[j-1])+")").remove("img");}}
  		}
  		if(buscarNuevoDulce==0){
  			buscarNuevoDulce=1;
  			for(var k=1;k<8;k++){
  				for(var j=0;j<(lenrest[k-1]-1);j++){
  					$(".col-"+k).prepend("<img src='' class='elemento' style='visibility:hidden'/>");
  				}
  			}
  		}
  		for(var j=1;j<8;j++){
  			if(conGen>(maxi-lenrest[j-1])){
  				numero=Math.floor(Math.random()*4)+1;
  				imagen="image/"+numero+".png";
  				$(".col-"+j).prepend("<img src="+imagen+" class='elemento'/>");
  			}
  		}
  	}
    if(conGen==1){
      clearInterval(nuevosDulces);
      eliminarDulce=setInterval(function(){
        eliminarFilaColumna()
      },150);
    }
    	conGen=conGen-1;
};

function validarHorizontal(){
  var valHori=0;
  for (var i = 0; i < 8; i++) {
    for (var j = 0; j < 6; j++) {
      var res1=$(".col-"+j).children("img:nth-last-child("+i+")").attr("src");
      var res2=$(".col-"+(j+1)).children("img:nth-last-child("+i+")").attr("src");
			var res3=$(".col-"+(j+2)).children("img:nth-last-child("+i+")").attr("src");
      if((res1==res2) && (res2==res3) && (res1!=null) && (res2!=null) && (res3!=null)){
        $(".col-"+j).children("img:nth-last-child("+(i)+")").attr("class","elemento activo");
        $(".col-"+(j+1)).children("img:nth-last-child("+(i)+")").attr("class","elemento activo");
        $(".col-"+(j+2)).children("img:nth-last-child("+(i)+")").attr("class","elemento activo");
        valHori=1;
      }
    }
  }
	return valHori;
};

function validarVertical(){
	var valVerti=0;
	for(var l=1;l<6;l++){
		for(var k=1;k<8;k++){
			var res1=$(".col-"+k).children("img:nth-child("+l+")").attr("src");
			var res2=$(".col-"+k).children("img:nth-child("+(l+1)+")").attr("src");
			var res3=$(".col-"+k).children("img:nth-child("+(l+2)+")").attr("src");
			if((res1==res2) && (res2==res3) && (res1!=null) && (res2!=null) && (res3!=null)){
				$(".col-"+k).children("img:nth-child("+(l)+")").attr("class","elemento activo");
				$(".col-"+k).children("img:nth-child("+(l+1)+")").attr("class","elemento activo");
				$(".col-"+k).children("img:nth-child("+(l+2)+")").attr("class","elemento activo");
				valVerti=1;
  			}
  		}
  	}
  	return valVerti;
  };

jQuery.fn.swap=function(b){
	b=jQuery(b)[0];
	var a=this[0];
	var t=a.parentNode.insertBefore(document.createTextNode(''),a);
	b.parentNode.insertBefore(a,b);
	t.parentNode.insertBefore(b,t);
	t.parentNode.removeChild(t);
	return this;
};

function gameOver(){
	$(".panel-score").animate({width:'100%'},3000);
	$(".termino").css({"display":"block","text-align":"center"});
};
