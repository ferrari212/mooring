function calculateAll (){
    // create a tab explanation point
      function showTooltip (x, y, contents) {
        $('<div id="tooltip">' + contents + '</div>').css({
          position: 'absolute', display:'none', top: y+5, left: x+5,
          border: ' x solid #fdd', padding: '2px',  'background-color':'#fee',
          opacity: 0.80
        }).appendTo('body').fadeIn(200);
      }



    // Insert data
      var w = parseFloat(document.getElementById("slide_w").value);
  		document.getElementById("w").value = w;
      var l = parseFloat(document.getElementById("slide_l").value);
  		document.getElementById("l").value = l;
      var z = parseFloat(document.getElementById("slide_z").value);
  		document.getElementById("z").value = z;
      var horizontalForce = parseFloat(document.getElementById("slide_horizontal_force").value);
  		document.getElementById("horizontal_force").value = horizontalForce;

    // Calculations
      var tractionForce = horizontalForce + w*z; // kgf (maximum traction force)
      const a = horizontalForce/w; // m (horizontal force-weight ratio)
      var s = Math.sqrt(z*(z+2*a)); // m (suspended line length)
      if (s>l) {alert('Length lesser than suspendend')};
      var angle = 180*Math.atan(s/a)/(Math.PI); // m (angle in mooring point)
      var verticalForce = w*s; // kgf (maximum vertical force)
      var bededMooring = [[0, 0], [s-l, 0]]; //m (coordinates of bedded Mooring)
      var x = a*Math.asinh(s/a); // m (Horizontal distance of the ship)
      var hangedMooring = []; // m (Vertical distance of the ship)
      var waterLine = [[s-l,z],[x,z]] // m (Water Line)

      const dx = x/25; // m (Distance variated)
      for (var i = x; i >= 0; i -= dx) {
        hangedMooring.push([i,a*(Math.cosh(i/a)-1)]);
      }

      // Plot important results
      $("#results").empty();
      $('<div"> Attraction radius = ' + (l-s+x).toFixed(2) + ' m;</div><br>').appendTo('#results');
      $('<div"> Suspended mooring line length = ' + s.toFixed(2) + ' m;</div><br>').appendTo('#results');
      $('<div"> Maximum traction force = ' + tractionForce + ' kgf;</div><br>').appendTo('#results');
      $('<div"> Maximum vertical force = ' + verticalForce.toFixed(2) + ' kgf;</div><br>').appendTo('#results');
      $('<div"> Angle in ship attraction point = ' + angle.toFixed(1) + '°;</div><br>').appendTo('#results');


    // introduce to plot
      data = [{data:bededMooring, label: "Bedded Mooring", lines:{show:true, width:0.5}},
        {data:hangedMooring, label: "Hanged Mooring", lines:{show:true},points:{show:true}, color: "#2f9a4e"},
        {data:waterLine, label: "Water Line", lines:{show:true, width:0.5}, color: "#0062FF"}];
      options = {legend:{position:'nw'},
                grid:{clickable:true, hoverable:true},
                axisLabels: {show: true},
                xaxes: [{axisLabel: 'distance (m)'}],
                yaxes: [{position: 'left',axisLabel: 'distance from bottom (m)'}]
              };

      // plot chart
      chart1 = $.plot($('#placeholder'), data, options);

    // highlight one element in chart
      $('#placeholder').bind('plothover', function(event, pos, item){
        $('#tooltip').remove();
        if (item) {
          // console.log(item.datapoint[0]);
          var x = item.datapoint[0].toFixed(2), y = item.datapoint[1].toFixed(2);
          showTooltip(item.pageX, item.pageY,
            item.series.label + ": x = " + x + " m; y = " + y + " m.");
        }
      });
};
