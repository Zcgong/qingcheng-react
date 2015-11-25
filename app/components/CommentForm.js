var React = require('react');
var ReactDOM = require('react-dom');
var MarkdownArea = require('./MarkdownArea');
var UserAvatar = require('./UserAvatar');
var ShowOverlayActions = require('../actions/ShowOverlayActions');
var CommentsActions = require('../actions/CommentsActions');
var shake = require('../utils').shake;

var CommentForm = React.createClass({
    getInitialState: function() {
        return {
            content: ''
        };
    },
    handleShowLogin: function() {
        ShowOverlayActions.showLogin(true);
    },
    handleChange: function(e) {
        var newState = {};
        newState[e.target.name] = e.target.value;
        this.setState(newState);
    },
    handleFormSubmit: function(e) {
        e.preventDefault();
        var content = this.state.content.replace(/(^\s*)|(\s*$)/g, "");
        if ( !content || 480 - content.length < 0 ) {
            return shake(ReactDOM.findDOMNode(this.refs.form));
        }
        var payload = {content: content};
        CommentsActions.createTopicComment(this.props.topic.id, payload, function(){
            this.setState({content: ''});
        }.bind(this));
    },
    render: function() {
        current_user = this.props.current_user;
        return (
			<form className="comment-form" ref="form" onSubmit={ this.handleFormSubmit }>
                {
                    (function(obj){
                        if ( !current_user.id ) {
                            return <div className="comment-form-mask" onClick={obj.handleShowLogin}></div>;
                        }
                    }(this))
                }
                {
                    (function(obj){
                        if ( current_user.id ) {
                            return <UserAvatar user={ current_user } clazz="small circle" />;
                        }
                    }(this))
                }
				<MarkdownArea clazz="comment-item" placeholder="Write your response" current_user={current_user} content={ this.state.content } handleChange={ this.handleChange }></MarkdownArea>
                {
                    (function(obj){
                        if ( current_user.id ) {
                            return <button className="button">Reply</button>;
                        }
                    }(this))
                }
			</form>
        );
    }
});

module.exports = CommentForm;
