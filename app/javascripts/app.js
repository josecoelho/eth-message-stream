// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Import libraries we need.
import { default as Web3} from 'web3';
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import messagestream_artifacts from '../../build/contracts/MessageStream.json'

// MessageStream is our usable abstraction, which we'll use through the code below.
var MessageStream = contract(messagestream_artifacts);

// The following code is simple to show off interacting with your contracts.
// As your needs grow you will likely need to change its form and structure.
// For application bootstrapping, check out window.addEventListener below.
var accounts;
var account;

window.App = {
  start: function() {
    var self = this;

    MessageStream.setProvider(web3.currentProvider);

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function(err, accs) {
      if (err != null) {
        alert("There was an error fetching your accounts.");
        return;
      }

      if (accs.length == 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.");
        return;
      }

      accounts = accs;
      account = accounts[0];

      self.refreshBalance();
      self.populateAccoutSwitcherHTML();

      self.handleToggleShowButton('account-switcher-open', 'account-switcher-wrapper');
      self.handleToggleShowButton('message-sender-open', 'message-sender');

      self.getMessages();
    });

    var self = this;
    var eventReceived = false;
    MessageStream.deployed().then(function(instance) {
      instance.MessageReceived().watch(function(err, result) {
        console.log("event received");
        if(err) {return;}
        self.updateOrPrependMessagesHTML(result.args.index,
            result.args.title,
            result.args.body,
            result.args.imageUrl,
            result.args.created_at,
            result.args.likes);
      })
    });
  },

  switchAccount: function(index) {
    account = accounts[index];
    this.refreshBalance();
    this.getMessages();
    this.toggleShowElement(document.getElementById('account-switcher-wrapper'));
  },

  refreshBalance: function() {
    var self = this;

    var balance = web3.fromWei(web3.eth.getBalance(account));

    var balance_element = document.getElementById("balance");
    balance_element.innerHTML = balance.toFixed(2);

    var account_element = document.getElementById("account");
    account_element.innerHTML = account;
  },

  getMessages: function() {
    var self = this;

    var instance;
    var promises = [];

    MessageStream.deployed().then(function(_instance) {
          instance = _instance;
          return instance.getNumberOfMessages.call()
        }).then(function(count) {

          for (var i = 0; i < count; i++) {
              promises[i] = instance.getMessage.call(i);
          }

          return Promise.all(promises);

        }).then(function(results) {
          self.clearMessagesHTML();
          for (var i = 0; i < results.length; i++) {
            var result = results[i];
            self.updateOrPrependMessagesHTML(i, result[0], result[1], result[2], result[3], result[4]);
          }
        });
  },

  setStatus: function(message) {
    var status = document.getElementById("status");
    status.innerHTML = message;
  },

  sendMessage: function(evt) {
    var title = document.getElementById("title").value;
    var body = document.getElementById("message_body").value;
    var image = document.getElementById("message_image").value;
    this.toggleShowElement(document.getElementById('message-sender'));

    MessageStream.deployed().then(function(instance) {
      return instance.sendMessage(title, body, image, {from: account, gas: 3000000});
    })
  },

  likeMessage: function(index) {
    console.log("Like:"+index);
    var self  = this;
    var contract;
    MessageStream.deployed().then(function(instance) {
      contract = instance;
      return contract.likeMessage(index, {from: account, gas: 3000000})
    }).catch(function() {
      alert("You can not like your own message!");
    }).then(function(result) {
      if(!result) { return; }
      return contract.getMessage.call(index);
    }).then(function(result) {
      if(!result) { return; }
      self.updateOrPrependMessagesHTML(index, result[0], result[1], result[2], result[3], result[4]);
    });
  },

  handleToggleShowButton: function(buttonId, targetId) {
    var self = this;
    var button = document.getElementById(buttonId);
    button.addEventListener('click', function() {
      self.toggleShowElement(document.getElementById(targetId));
    });
  },

  toggleShowElement: function(element) {
    if(element.style.display == 'none') {
      element.style.display = 'block';
    } else {
      element.style.display = 'none';
    }
  },

  populateAccoutSwitcherHTML: function() {
    var self = this;
    var accountSwitcher = document.getElementById("account-switcher");
    accounts.forEach(function(item, index) {
      var option = document.createElement("option");
      option.value = index;
      option.innerHTML = account;
      accountSwitcher.appendChild(option);
    });

    accountSwitcher.addEventListener('change', function(evt) {
      self.switchAccount(this.value);
    });
  },

  clearMessagesHTML: function() {
    var list = document.getElementById("message-stream");
    list.innerHTML = "";
  },

  formatDate: function(timestamp) {
    return new Date(timestamp * 1e3).toISOString().slice(-13, -5);
  },

  populateMessageTemplate: function(index, title, body, imageUrl, created_at, likes) {

    var template = document.getElementById("message-template").innerHTML;

    var message = document.createElement("div");
    message.id = "message-"+index;

    var templateHTML = template
      .replace('{{index}}', index)
      .replace('{{title}}', title)
      .replace('{{body}}', body)
      .replace('{{likes}}', likes)
      .replace('{{date}}', this.formatDate(created_at));

    if(imageUrl) {
      templateHTML = templateHTML.replace('{{image}}', "<img src=\""+imageUrl+"\" class='thumb-image'>")
    } else {
      templateHTML = templateHTML.replace('{{image}}', "")
    }
    message.innerHTML = templateHTML;

    return message;
  },

  setupLikeEventListener: function(messageEl) {
    var self = this;
    var likeButton = messageEl.getElementsByClassName("message-like")[0];

    likeButton.addEventListener('click', function(evt) {
      self.likeMessage(this.value);
    });
  },

  updateOrPrependMessagesHTML: function(index, title, body, imageUrl, created_at, likes) {
    var message = this.populateMessageTemplate(index, title, body, imageUrl, created_at, likes);

    var currentEl = document.getElementById("message-"+index);
    if(currentEl) {
      currentEl.innerHTML = message.innerHTML;
      this.setupLikeEventListener(currentEl);
    } else {
      var list = document.getElementById("message-stream");
      list.insertBefore(message, list.childNodes[0]);
      this.setupLikeEventListener(message);
    }

  },

};

window.addEventListener('load', function() {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 MessageStream, ensure you've configured that source properly. If using MetaMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-metamask")
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.warn("No web3 detected. Falling back to http://localhost:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to Metamask for development. More info here: http://truffleframework.com/tutorials/truffle-and-metamask");
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    // window.web3 = new Web3(new Web3.providers.HttpProvider("http://192.168.1.25:8545"));
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

  App.start();
});
