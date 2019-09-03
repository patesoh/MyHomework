// from data.js
var tbody = d3.select("tbody");

console.log(data);

// Use D3 arrow function to populate the table with all data from data.js
data.forEach((UFOReport) => {
    var row = tbody.append("tr");
    Object.entries(UFOReport).forEach(([key, value]) => {
      var cell = row.append("td");
      cell.text(value);
    });
  });

//   Use jquery datatable feature to build in a master search feature
// and build a column-specific search box for all columns in the table, that also has a sort feature, at the top of the table
$('#ufo-table thead th').each( function () {
    var title = $('#ufo-table tfoot th').eq( $(this).index() ).text();
    $(this).html( '<input type="text" placeholder="Search '+title+'" />' );
} );

// DataTable
var table = $('#ufo-table').DataTable();

// Apply the search
table.columns().eq( 0 ).each( function ( colIdx ) {
    $( 'input', table.column( colIdx ).header() ).on( 'keyup change', function () {
        table
            .column( colIdx )
            .search( this.value )
            .draw();
    } );
} );

// Keep the column headers on top
$('#ufo-table tfoot tr').appendTo('#ufo-table thead');



