import { Component, ViewChild } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public title = 'Block.one Test';
  public fullData = [];
  public blocks = [];
  public columns = [];
  public blockCount = 0;
  public loading = false;
  public selectedRowData = '';
  public selectedRow = -1;

  // set a few initial values and get the table headers
  constructor(private http: HttpClient) {
     this.columns = this.getColumns();
     this.selectedRow = -1;
  }

  // load the blocks from the node server RESTful API
  loadBlocks() {
     this.blocks = [];
     var url = "http://localhost:3000/get_blocks";
     console.log(" --- calling " + url);
     this.loading = true;
     const req = this.http.get(url)
     .subscribe(
        res => {
	var output = JSON.parse(JSON.stringify(res) );
	this.fullData = output.output;
	this.loading = false;

	this.getBlockSummary();

        },
	err => {
	   console.log("Error Occurred");
	   console.log( err.error.text );
        }
     );
  }

  // get the table column headers
  getColumns(): string[]{
     return ["ID", "Timestamp", "Action Count"]
  };

  // creates the blocks array of data needed to display on the table
  getBlockSummary() {
     // long conversion from type any[] to parsed data
     var tdata = JSON.parse(JSON.parse(JSON.stringify(this.fullData)));
     var numitems = tdata.length;
     var obj = {'id':'','timestamp':'','numactions':0, 'index':0, 'fulldata':''};

     // get the column fields as well as the fulldata (raw block data), if the user clicks a row
     for(var i=0; i<numitems; i++) {
        obj.index = i+1;
	obj.id = tdata[i].id;
	obj.timestamp = tdata[i].timestamp;
        obj.numactions = this.getActionCount(tdata[i].transactions);
        obj.fulldata = JSON.stringify(tdata[i],null,4);
	this.blocks.push(obj);

	// force flush the data
	obj = {'id':'','timestamp':'','numactions':0, 'index':0, 'fulldata':''};

     }
  }

  // loop through a transaction field, looking for trx that is not just a string, add the actions array length
  getActionCount( data ) {
     var map = '';
     var cnt = 0;
     for(var i=0; i<data.length; i++) {
        if( typeof data[i].trx === 'string' ) {
           continue;
        } else {
           cnt += data[i].trx.transaction.actions.length; 
        }
     }
     console.log("actions = " + cnt);
     return(cnt);
  }

  // when the user clicks a row, set the row index and make the raw block data (fulldata) available to the view
  clickRow(x) {
  console.log("click " + x.index);
     if(this.selectedRow === x.index) {
        this.selectedRow = -1;
     } else {
        this.selectedRow = x.index;
     }
     this.selectedRowData = x.fulldata;
     //console.log(this.selectedRowData);
  }

}
