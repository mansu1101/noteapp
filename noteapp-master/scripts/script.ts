//JQuery
module TsScript {
	
	 interface dataOptions
    {
        userId: string;
        userName: string;
        date: string;
        message: string;
    }
 
    export class User {
        userId = "1";

        constructor() {

        }

        setUser(userId) {
            this.userId = userId;
        }

        geUser() {
            return parseInt(this.userId)
        }

    }

    export class Json {
        json = [];

        constructor(json) {
            this.json = json;
        }


        geJsonData() {
            return this.json;
        }

        setJsonData(data) {
            this.json.push({
                "userId": new User().geUser(),
                "userName": "MJ",
                "date": "27/08/2020",
                "message": data
            })
        }

        editData(index, message) {
            let data = this.json[index];
            data["message"] = message;
            data["isEdit"] = false;
            this.json[index] = data;
        }

        setEditDataFlag(index) {
            let data = this.json[index];
            data["isEdit"] = true;
            this.json[index] = data;
        }

        deleteData(index) {
            this.json.splice(index, 1);
        }

    }

    export class SubmitData {
        submitData: any = "";
        constructor(submitData) {
            this.submitData = submitData;
        }

        getSubmitBoxData() {
            return this.submitData;
        }

        loadSubmitBox(data, jsonData, submitFunction, cancelFunction) {
			
            let $html = $('<div />', {html: data,  class: 'edit-message-item mb-4'});
            $html.find('#messageBox').val(jsonData.message);
            $html.find("#SubmitButton").click(function () {
                if ($html.find('#messageBox').val()) {
                    submitFunction($html.find('#messageBox').val());
                }

            });
            $html.find("#cancelButton").click(cancelFunction);
            return $html;
        }


    }

    export class ViewData {

        viewData: any = "";

        constructor(viewData) {
            this.viewData = viewData;
        }

        getViewData() {
            return this.viewData;
        }
        loadViewData(data, jsonData, editFunction, deleteFunction) {
           
		    console.log(jsonData.userId ==  new User().userId);
			let userClass = (jsonData.userId ==  new User().userId) ? 'current-user' : 'recepient';	
		  
		   let $html = $('<div />', {html: data, class: 'message-item mb-4 '+ userClass});
            $html.find('[ message-user]').text(jsonData.userName);
            $html.find('[message-date]').text("(" + jsonData.date + ")");
            $html.find('[message-text]').text(jsonData.message);
         
		 
            if (new User().geUser() === parseInt(jsonData.userId)) {

                $html.find("[message-delete]").click(deleteFunction);
                $html.find("[message-edit]").click(editFunction);
            }
			
				
			
			
			
			
            return $html;
        }


    }

    export class init {
        // Fields
        jsonClass: Json;
        viewDataClass: ViewData;
        submitBoxClass: SubmitData;
        element: JQuery;

        constructor(element: JQuery, jsonData, viewData, submitData) {
            this.element = element;
            this.jsonClass = new Json(jsonData);
            this.viewDataClass = new ViewData(viewData);
            this.submitBoxClass = new SubmitData(submitData);
        }


        loadViewData(jsonData, index) {
            if (jsonData.isEdit) {
                let submitData = this.submitBoxClass.getSubmitBoxData();
                const editFunction = (value) => {
                    this.jsonClass.editData(index, value);
                    this.loadMainData();
                };
                const cancelFunction = () => {
                    this.loadMainData();
                };
                return this.submitBoxClass.loadSubmitBox(submitData, jsonData, editFunction, cancelFunction);

            } else {
                let viewData = this.viewDataClass.getViewData();

                const editFunction = () => {
                    this.jsonClass.setEditDataFlag(index);
                    this.loadMainData();
                };
                const deleteFunction = () => {
                    this.jsonClass.deleteData(index);
                    this.loadMainData();
                };
                return this.viewDataClass.loadViewData(viewData, jsonData, editFunction, deleteFunction);
            }


        }

        emptyHtml() {
            this.element.html("");
        }

        addSaveButton() {
            let submitData = this.submitBoxClass.getSubmitBoxData();
            const editFunction = (value) => {
                this.jsonClass.setJsonData(value);
               
                this.loadMainData();
            };
            const cancelFunction = () => {
                this.loadMainData();
            };
            this.element.append(this.submitBoxClass.loadSubmitBox(submitData, {message: ""}, editFunction, cancelFunction));
        }


        loadMainData() {
            //  this.element.append('<div>hello div</div>');
            this.emptyHtml();
            let json = this.jsonClass.geJsonData();
			console.log("json", json);
		   let $html = $('<div />', {html: '', class: 'message-listing mt-3 mb-3 '});
            for (let index = 0; index < json.length; index++) {
                let data = this.loadViewData(json[index], index);	
		        $html.append(data);
            }

				this.element.append( $html);

            this.addSaveButton();
        }
    }
}


//jquery plugin wrapper.
;(function (w, $) {
    if (!$) return false;

    $.fn.extend({
        loadMyHtml: function (opts) {
           
            let jsonData = {};
            let createMessageView = "";
            let messagesListingView = "";
		 
            return this.each(function () {
                fetch("data.json")
                    .then(response => response.json())
                    .then(json => {
                        jsonData = json;
                        $.get("/templates/create-message.html", '', (cView) => {
                         
                            createMessageView = cView;
                            $.get("/templates/messages.html", '', (lView) => {
                                messagesListingView = lView;
                                new TsScript.init($(this), jsonData, messagesListingView, createMessageView).loadMainData();
                                return;
                            });
                        });
                    });


            });
        }
    });
})(window, jQuery);

$(function () {
    $('#chatapp').loadMyHtml({});
});

