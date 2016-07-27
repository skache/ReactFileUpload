var Router  = ReactRouter.Router;
var IndexRoute = ReactRouter.IndexRoute;
var Route = ReactRouter.Route;
var ReactBsTable  = require('react-bootstrap-table');
var BootstrapTable = ReactBsTable.BootstrapTable;
var TableHeaderColumn = ReactBsTable.TableHeaderColumn;
var FileUpload = require('react-fileupload');
var Dropzone = require('react-dropzone');
var Link = ReactRouter.Link;
var fs = require('fs');
var request = require("superagent");
var UploadList = React.createClass({
   getInitialState: function() {
	return {
	   creds: []
	};
  },
  componentDidMount: function() {
	  
	  this.serverRequest = $.get("http://localhost:3000/listFiles", function (result) {
		    console.log(result);
		    this.setState({
            creds: result
		});
	  }.bind(this));
  },
  
  componentWillUnmount: function() {
    this.serverRequest.abort();
  },
  
    fetchData: function () {
        var _this = this;
        $.get("http://localhost:3000/listFiles", function (result) {
            _this.setState({
            creds: result
		})
			
			
        });
    },
	uploadFile: function (e) {
		  var fd = new FormData();
		  var xhr = new XMLHttpRequest();
		  xhr.open("POST", "http://localhost:3000/api/photo", true);
		  xhr.onreadystatechange = function() {
			if (xhr.readyState == 4 && xhr.status == 200) {
				// Every thing ok, file uploaded
				  console.log(xhr.responseText); // handle response.
			}
		};
		fd.append("userPhoto", this.state.image);
		xhr.send(fd);
		this.fetchData();
	  e.preventDefault()
	},
	onFileSelect: function(e){
        this.setState({image: e.target.files[0]});
    },
  
  delete1(event) {
    let postId = event.target.parentNode.getAttribute("data-id");
      $.ajax({
         url: 'http://localhost:3000/deleteFile/' + postId,
         type: "DELETE",
         success: function(data) {
          console.log(data);
		  this.fetchData();
         }.bind(this)
      });
  },
  
  render: function(){
	  
	var credentials = this.state.creds || [];
	return (

	<div className="row main-content">
		<div className="modal-body">
			<div className="row">
				<div className="col-md-12" id="orgtable">
					<div role="grid" className="dataTables_wrapper form-inline device nopadding box clearfix scrollpan" id="DataTables_Table_0_wrapper">
						<input type="hidden" id="IdToBeHidden" value="0" />
						<input type="hidden" id="LabelToBeHidden" value="0" />
						<form ref="uploadForm" className="uploader" encType="multipart/form-data" >
						<div className="input-class">
							<input type="file" onChange={this.onFileSelect}/><input type="button" className="btn btn-default btn-file" value="Upload Image" onClick={this.uploadFile}/>
							</div>
			            </form>                
						<table className="table table-bordered">
							<thead>
								<tr>
									<th className="firstTh"><div>File Name</div></th>
									<th><div>File Size</div></th>
									<th><div>Created On</div></th>
									<th>DownloadEdit</th>
                                    <th>Delete</th>
								</tr>
							</thead>
							<tbody>

							   {credentials.map(function(credential){
								   return(
									<tr key={credential.filename}>
										<td>{credential.filename}</td>
										<td>{credential.size}</td>
										<td>{credential.creation}</td>
										<td><button type="button" className="btn btn-default"><a download={credential.filename} className="link" href={'./uploads/'+credential.filename} is="null">Download</a></button></td>
						                <td data-id={'./uploads/'+credential.filename}><a onClick={this.delete1}>delete</a></td>
									</tr>
								   )
							   }.bind(this))}

							</tbody>
						</table>
					</div>
				</div>
			</div>	
		</div>
	</div>
		
		)
	}
});

ReactDOM.render((
  <Router>
    <Route path="/" component={UploadList} />
	<Route path="/cred" component={UploadList}/>
	</Router>
), document.getElementById('app'));