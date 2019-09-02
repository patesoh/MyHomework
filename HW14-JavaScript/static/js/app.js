// from data.js
var tbody = d3.select("tbody");

console.log(data);

// Use D3 Refactor to populate the table with all data from data.js
data.forEach((UFOReport) => {
    var row = tbody.append("tr");
    Object.entries(UFOReport).forEach(([key, value]) => {
      var cell = row.append("td");
      cell.text(value);
    });
  });

//   Use jquery datatable feature to build in a master search feature
// and build a column
$(document).ready(function() {
    // Setup - add a text input to each footer cell
    $('#ufo-table thead th').each( function () {
        var title = $('#ufo-table tfoot th').eq( $(this).index() ).text();
        $(this).html( '<input type="text" placeholder="Search '+title+'" />' );
    } );

    // DataTable
    var table = $('#ufo-table').DataTable();

    // Apply the search
    table.columns().eq( 0 ).each( function ( colIdx ) {
        $( 'input', table.column( colIdx ).header() ).on( 'keyup change clear', function () {
            table
                .column( colIdx )
                .search( this.value )
                .draw();
        } );
    } );
} );