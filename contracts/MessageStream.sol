pragma solidity ^0.4.4;

contract MessageStream {
    struct Message {
      string title;
      string body;
      uint created_at;
      uint likes;
      address owner;
    }
    
    uint _numberOfMessages;

    /* "array" of messages */
    mapping(uint => Message) _messages;

    event MessageReceived(string title, string body);

    function MessageStream() {
      _numberOfMessages = 0;
    }

    function sendMessage(string _title, string _body) {
      Message memory m = Message(_title, _body, now, 0, msg.sender);
      _messages[_numberOfMessages] = m;
      _numberOfMessages++;

      MessageReceived(_title, _body);
    }

    function getMessage(uint index) returns(string title, string body, uint created_at, uint likes) {
      Message m = _messages[index];
      title = m.title;
      body = m.body;
      created_at = m.created_at;
      likes = m.likes;
    }

    function likeMessage(uint index) {
      Message memory m = _messages[index];

      require(m.owner != msg.sender);

      _messages[index].likes++;
    }

    function getNumberOfMessages() returns(uint numberOfMessages) {
      numberOfMessages = _numberOfMessages;
    }


}
