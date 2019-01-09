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
        //console.log(this.fullData.length);

	this.getBlockSummary();

        },
	err => {
	   console.log("Error Occurred");
	   console.log( err.error.text );
        }
     );
  }
 
  getBlocks() {
  
  }

  getColumns(): string[]{
     return ["ID", "Timestamp", "Action Count"]
  };

  getBlockSummary() {
     // long conversion from type any[] to parsed data
     var tdata = JSON.parse(JSON.parse(JSON.stringify(this.fullData)));
     var numitems = tdata.length;

     //console.log(tdata.length);
     //console.log(tdata);
     var obj = {};//{'id':'','timestamp':'','numactions':0};
     for(var i=0; i<numitems; i++) {
        obj.index = i+1;
	obj.id = tdata[i].id;
	obj.timestamp = tdata[i].timestamp;
        obj.numactions = this.getActionCount(tdata[i].transactions);
        obj.fulldata = JSON.stringify(tdata[i],null,4);
	this.blocks.push(obj);
	obj = {};
     }
     //     console.log(this.blocks);   
  }

  getActionCount( data ) {
     var map = '';
     var cnt = 0;
     for(var i=0; i<data.length; i++) {
        if( typeof data[i].trx === 'string' ) {
           continue;
        } else {
	//console.log("found actions in transaction " + i);
           cnt += data[i].trx.transaction.actions.length; 
        }
     }
     console.log("actions = " + cnt);
     return(cnt);
  }

  clickRow(x) {
  console.log("click " + x.index);
     if(this.selectedRow === x.index) {
        this.selectedRow = -1;
     } else {
        this.selectedRow = x.index;
     }
     this.selectedRowData = x.fulldata;
     console.log(this.selectedRowData);
  }

}
