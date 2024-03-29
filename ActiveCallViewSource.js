
<!DOCTYPE html>
<html>
<head>
    <title>Active Calls</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no" />
    <link rel="shortcut icon" type="image/ico" href="./favicon.ico">

    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="//code.jquery.com/ui/1.9.1/themes/smoothness/jquery-ui.css" />
    <link rel="stylesheet" type="text/css" href="//cdn.datatables.net/v/dt/dt-1.10.16/b-1.5.1/b-colvis-1.5.1/b-html5-1.5.1/datatables.min.css" />
    <link rel="stylesheet" type="text/css" href="//cdn.datatables.net/1.10.16/css/jquery.dataTables.min.css" />
    <link rel="stylesheet" type="text/css" href="//cdn.datatables.net/responsive/2.2.1/css/responsive.dataTables.min.css" />

   

    <style type="text/css" class="init"></style>
    <script type="text/javascript" language="javascript" src="//code.jquery.com/jquery-1.12.3.min.js"></script>
    <script type="text/javascript" language="javascript" src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
    <script type="text/javascript" src="https://cdn.datatables.net/v/dt/dt-1.10.16/b-1.5.1/b-html5-1.5.1/datatables.min.js"></script>
    <script type="text/javascript" language="javascript" src="Web/responsive/js/dataTables.responsive.min.js"></script>
    <script type="text/javascript" src="https://cdn.datatables.net/responsive/2.2.1/js/dataTables.responsive.min.js"></script>
    <script type="text/javascript" src="//cdn.datatables.net/plug-ins/1.10.16/dataRender/ellipsis.js"></script>
    <script type="text/javascript" language="javascript" src="//cdnjs.cloudflare.com/ajax/libs/jszip/2.5.0/jszip.min.js"></script>
    <script src="https://code.jquery.com/ui/1.12.0/jquery-ui.min.js" integrity="sha256-eGE6blurk5sHj+rmkfsGYeKyZx3M4bG+ZlFyA7Kns7E=" crossorigin="anonymous"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/moment.js/2.8.4/moment.min.js"></script>
    <script src="//cdn.datatables.net/plug-ins/1.10.16/sorting/datetime-moment.js"></script>

    <script type="text/javascript" language="javascript"></script>
    <style type="text/css">
        body {
            background-color: #0052A6;
        }

        body {
            margin: .75em;
        }
    </style>



</head>
<body>

    <div class="panel-heading text-center" style="background-color: steelblue;">
        <div class="row">
            <div class="col-lg-2" title="Return to Clearwater Police Home Page">
                <a href="http://www.clearwaterpolice.org/home">
                    <img border="0" alt="Link to home page" src="./CPD_Badge.png" />
                </a>
            </div>
            <div class="col-lg-10" style="font-size: 2em; text-align: center;">Clearwater Police Department Active Calls</div>
        </div>
    </div>



    <div id="main-content" cellspacing="0" style="background-color: lightsteelblue;">

        <table id='ActiveCalls' class="table-bordered table-responsive display nowrap" cellspacing="0">
            <thead>
                <tr>
                    <th Style="width:30%">DESCRIPTION</th>
                    <th Style="width:10%">INCIDENT NUMBER</th>                   
                    <th Style="width:30%">STREET ADDRESS</th>
                    <th Style="width:20%">RESPONSE TIME</th>
                </tr>
            </thead>
        </table>
    </div>

    <footer class="panel-footer text-center" style="font-size: 1em; background-color: lightsteelblue;">
        This list represents some of the calls for police service being handled by officers of the Clearwater Police Department. The call description is as received in the dispatch center; the final outcome of the investigation may be different. This information is delayed by approximately 20 minutes.
        <br />The screen will automatically refresh approximately every 60 seconds.
        <p id="LastRefreshed"></p>
        Developed by the City of Clearwater Department of Information Technology

        <br />
        <span id="Copyright" class="glyphicon glyphicon-copyright-mark"></span>


    </footer>
</body>
</html>

<script type="text/javascript">
    "use strict";
    $(document)
        .ready(function () {
            var d = new Date();
            $('#Copyright').html('Copyright '.concat(d.getFullYear()).concat(' all rights reserved'));
            $.fn.dataTable.moment('h:mm A');
            var activeCalls = $('#ActiveCalls').DataTable(
                      {
                          responsive: true,
                          stateSave: true,
                          dom: 'fiptl',
                          'ajax': 'api/ActiveCalls',
                          order: [3, "desc"],
                          'columns': [
                                      {
                                          data: 'DESCRIPTION',
                                          render: function (data, type, row) {
                                              return row.Online_Description;
                                          }
                                      },
                                      {
                                          data: 'INCIDENT NUMBER',
                                          render: function (data, type, row) {
                                              return row.Master_Incident_Number;

                                          }
                                      },

                                      {
                                          data: 'STREET ADDRESS',
                                          render: function (data, type, row) {
                                              return row.Address;
                                          }
                                      },
                                      {
                                          data: 'RESPONSE TIME',                                         
                                          render: function (data, type, row) {
                                              var str = row.Response_Date.split("T");
                                              var date = str[0].split("-");
                                              var time = str[1].split(":");
                                              date = new Date(date[0], date[1] - 1, date[2], time[0], time[1], time[2], 0);
                                              return date.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' });
                                          }
                                      }
                          ]
                      });

            $.get("api/CallType", function (data) {
                $('#OnlineDescription').append($('<option />').val('').text('All'));
                for (var key in data.data) {
                    var obj = data.data[key];
                    $('#OnlineDescription').append($('<option />').val(obj.Online_Description).text(obj.Online_Description));
                }
            });


            $('#OnlineDescription').on('change', function () {
                refreshPage();
            });

            setInterval(function () {
                refreshPage();
            }, 60000);


            function refreshPage() {

                var ajaxUrl = "api/ActiveCalls";

                activeCalls.clear();
                activeCalls.draw();
                activeCalls.ajax.url(ajaxUrl).load();
                var today = new Date();
                $('#LastRefreshed').text('Last Refreshed '.concat(today.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' })));
            }
        });
</script>
