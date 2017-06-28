pragma solidity ^0.4.2;

contract MessageStream {
    string title;

    event MessageReceived(string _title, string _body);

    function MessageStream() {
    }

    function sendMessage(string _title, string _body) {
      MessageReceived(_title, _body);
    }

    function getMessage() returns(string){
      return "Test";
    }

}
