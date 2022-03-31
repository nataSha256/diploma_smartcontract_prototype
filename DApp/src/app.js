App = {
    web3: null,
    contracts: {},
	address:'',
    network_id:3, // 5777 for local
    handler:null,
    value:1000000000000000000,
    index:0,
    margin:10,
    left:15,
    init: function() {
      return App.initWeb3();
    },
  
    initWeb3: function() {         
      if (typeof web3 !== 'undefined') {
        App.web3 = new Web3(Web3.givenProvider);
      } else {
        App.web3 = new Web3(App.url);
      }
	  ethereum.enable();
	  return App.initContract(); 
    },

    initContract: function() { 
      App.contracts.Diploma = new App.web3.eth.Contract(App.abi,App.address, {});
      // console.log(random)   
      return App.bindEvents();
    },  
  
    bindEvents: function() {  
		$(document).on('click', '#update_info', function () {
			App.handleUpdateInfo(jQuery('#ipfs').val(), jQuery('#description').val(), jQuery('#ects').val());
      });
  
		$(document).on('click', '#update_state',function(){
			App.handleUpdateState(jQuery('#state').prop("checked"));
      });
      
		
    },

    populateAddress : function(){  
      App.web3.eth.getAccounts((err, accounts) => {  
        if(!err){
          App.handler=accounts[0];
        }
      })
	},  

	handleCheckDiploma: function (smartContractAddress) {
		if (smartContractAddress === '' || smartContractAddress.length != 42) {
			alert("Please enter a valid Smart Contract Address.")
			return false
		}
		App.address = smartContractAddress;
		App.init();
		App.populateAddress();
		App.NUGet();
		App.infoGet();

	},
  
    handleUpdateInfo:function(ipfsValue, descriptionValue, ectsValue){
		if (ipfsValue===''){
        alert("Please enter a valid IPFS value.")
        return false
		}
		if (ectsValue.length == 0 || ectsValue < 0) {
			alert("Please enter a valid ECTS value.")
			return false
		}
      var option={from:App.handler}    
		App.contracts.Diploma.methods.setDiploma(ipfsValue, descriptionValue, ectsValue)
      .send(option)
      .on('receipt',(receipt)=>{
        if(receipt.status){
			toastr.success('IPFS is set to ' + ipfsValue + ', description is set to "' + 
				descriptionValue + '", ECTS credits are set to ' + ectsValue + '.');
      }})
      .on('error',(err)=>{
        toastr.error("Only the University can update information.");
      })
	},

	handleUpdateState: function (state) {
		var state_str;
		if (state == false) {
			state_str = "false";
		}
		else {
			state_str = "true";
        }
		var option = { from: App.handler }
		App.contracts.Diploma.methods.setActive(state_str)
			.send(option)
			.on('receipt', (receipt) => {
				if (receipt.status) {
					toastr.success('Diploma is set to ' + (state ? 'Active' : 'Revoked') + '.');
				}
			})
			.on('error', (err) => {
				toastr.error("Only the University can update information.");
			})
	},

	NUGet: function () {
		App.contracts.Diploma.methods.contractOwner()
			.call()
			.then((r) => {
				jQuery('#NU_Account_Address').text(r)
			})
	},

	infoGet: function () {
		App.contracts.Diploma.methods.getDiploma()
      .call()
      .then((r)=>{
		  jQuery('#Student_Account_Address').text(r[0])

		  jQuery('#ipfs').val(r[1])
		  jQuery('#img_diploma').attr("src", "https://ipfs.io/ipfs/" + r[1]);


		  jQuery('#description').val(r[2])
		  if (r[3] == 'true') {
			  jQuery('#state').prop('checked', true)
		  }
		  else {
			  jQuery('#state').prop('checked', false)
          }
		  
		  jQuery('#ects').val(r[4])
	  })
		
    },

	abi: [
		{
			"constant": false,
			"inputs": [
				{
					"name": "_active",
					"type": "string"
				}
			],
			"name": "setActive",
			"outputs": [],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"constant": false,
			"inputs": [
				{
					"name": "_ipfsHash",
					"type": "string"
				},
				{
					"name": "_description",
					"type": "string"
				},
				{
					"name": "_eCTSCreditPoints",
					"type": "uint16"
				}
			],
			"name": "setDiploma",
			"outputs": [],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "function"
		},
		{
			"inputs": [
				{
					"name": "_sendToAccount",
					"type": "address"
				},
				{
					"name": "_ipfsHash",
					"type": "string"
				},
				{
					"name": "_description",
					"type": "string"
				},
				{
					"name": "_eCTSCreditPoints",
					"type": "uint16"
				}
			],
			"payable": false,
			"stateMutability": "nonpayable",
			"type": "constructor"
		},
		{
			"constant": true,
			"inputs": [],
			"name": "contractOwner",
			"outputs": [
				{
					"name": "",
					"type": "address"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		},
		{
			"constant": true,
			"inputs": [],
			"name": "getDiploma",
			"outputs": [
				{
					"name": "",
					"type": "address"
				},
				{
					"name": "",
					"type": "string"
				},
				{
					"name": "",
					"type": "string"
				},
				{
					"name": "",
					"type": "string"
				},
				{
					"name": "",
					"type": "uint16"
				}
			],
			"payable": false,
			"stateMutability": "view",
			"type": "function"
		}
	]


  }
  
  $(function() {
	  $(window).load(function () {
		$(document).on('click', '#check', function () {
			App.handleCheckDiploma(jQuery('#smart_contract_address').val());
		});
      toastr.options = {
        // toastr.options = {
          "closeButton": true,
          "debug": false,
          "newestOnTop": false,
          "progressBar": false,
          "positionClass": "toast-bottom-full-width",
          "preventDuplicates": false,
          "onclick": null,
          "showDuration": "300",
          "hideDuration": "1000",
          "timeOut": "5000",
          "extendedTimeOut": "1000",
          "showEasing": "swing",
          "hideEasing": "linear",
          "showMethod": "fadeIn",
          "hideMethod": "fadeOut"
        // }
      };
    });
  });
  
