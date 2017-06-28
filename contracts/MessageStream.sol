pragma solidity ^0.4.2;

contract MessageStream {
    struct Message {
      uint timestamp;
      string title;
      string body;
    }
    
    uint _numberOfMessages;

    // "array" of messages
    mapping(uint => Message) _messages;

    event MessageReceived(string title, string body, uint timestamp);

    function MessageStream() {
      _numberOfMessages = 0;
    }

    function sendMessage(string _title, string _body) {
      Message memory m = Message({timestamp: now, title: _title, body: _body});
      _messages[_numberOfMessages] = m;
      _numberOfMessages++;

      MessageReceived(m.title, m.body, m.timestamp);
    }

    function getLastMessage() returns(string title, string body, uint timestamp) {
      Message memory m = _messages[_numberOfMessages-1];
      title = m.title;
      body = m.body;
      timestamp = m.timestamp; 
    }



}
