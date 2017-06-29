pragma solidity ^0.4.4;

contract MessageStream {
    struct Message {
      string title;
      string body;
      string imageUrl;
      uint created_at;
      uint likes;
      address owner;
    }
    
    uint _numberOfMessages;

    /* "array" of messages */
    mapping(uint => Message) _messages;

    event MessageReceived(uint index, string title, string body, string imageUrl, uint created_at, uint likes);

    function MessageStream() {
      _numberOfMessages = 0;
    }

    function sendMessage(string _title, string _body, string _imageUrl) {
      Message memory m = Message(_title, _body, _imageUrl, now, 0, msg.sender);
      _messages[_numberOfMessages] = m;

      MessageReceived(_numberOfMessages, m.title, m.body, m.imageUrl, m.created_at, m.likes);
      _numberOfMessages++;
    }

    function getMessage(uint index) returns(string title, string body, string imageUrl, uint created_at, uint likes) {
      Message m = _messages[index];
      title = m.title;
      body = m.body;
      imageUrl = m.imageUrl;
      created_at = m.created_at;
      likes = m.likes;
    }

    function likeMessage(uint index) returns(uint likes){
      Message memory m = _messages[index];

      require(m.owner != msg.sender);

      return _messages[index].likes++;
    }

    function getNumberOfMessages() returns(uint numberOfMessages) {
      numberOfMessages = _numberOfMessages;
    }


}
