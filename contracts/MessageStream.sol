pragma solidity ^0.4.4;

contract MessageStream {
    struct Message {
      string title;
      string body;
      uint created_at;
    }
    
    uint _numberOfMessages;

    // "array" of messages
    mapping(uint => Message) _messages;

    event MessageReceived(string title, string body);

    function MessageStream() {
      _numberOfMessages = 0;
    }

    function sendMessage(string _title, string _body) {
      Message memory m = Message(_title, _body, now);
      _messages[_numberOfMessages] = m;
      _numberOfMessages++;

      MessageReceived(_title, _body);
    }

    function getLastMessage() returns(string title, string body) {
      Message memory m = _messages[_numberOfMessages-1];
      title = m.title;
      body = m.body;
    }

    function getMessage(uint index) returns(string title, string body, uint created_at) {
      Message m = _messages[index];
      title = m.title;
      body = m.body;
      created_at = m.created_at;
    }

    // function getMessage(uint index)

    function getNumberOfMessages() returns(uint numberOfMessages) {
      numberOfMessages = _numberOfMessages;
    }


}
