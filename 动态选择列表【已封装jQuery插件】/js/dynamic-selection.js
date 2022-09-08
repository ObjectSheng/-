(function( $ ) {
    let defaultSetting = {
        isRadio: true,
        language: "ZH_CN",
        iconfont: {
            url: "",
            moveIcon: "",
            deleteIcon: ""
        },
        zh_CN: {
            add: "添加",
            option: "选项",
            move: "移动",
            remove: "删除"
        },
        en_US: {
            add: "add",
            option: "option",
            move: "move",
            remove: "remove"
        },
        insertFe: function(){
            let newDiv = $("<div></div>");
            newDiv.html(`
                <input type="${defaultSetting.isRadio? "radio":"checkbox"}" name="selectBox">
                <input type="text" value="${defaultSetting.isCN? defaultSetting.zh_CN.option:defaultSetting.en_US.option}" class="textInput">
                <span class="moveEl">
                    ${!defaultSetting.iconfont.url? (defaultSetting.isCN? defaultSetting.zh_CN.move:defaultSetting.en_US.move):""}
                    <i class="iconfont ${defaultSetting.iconfont.url? defaultSetting.iconfont.moveIcon:""}"></i>
                </span>
                <span class="deleteEl"">
                    ${!defaultSetting.iconfont.url? (defaultSetting.isCN? defaultSetting.zh_CN.remove:defaultSetting.en_US.remove):""}
                    <i class="iconfont ${defaultSetting.iconfont.url? defaultSetting.iconfont.deleteIcon:""}"></i>
                </span>`);
            newDiv.find(".textInput").on("input",defaultSetting.updataValue);
            newDiv.find(".deleteEl").on("click",defaultSetting.removeFe);
            newDiv.find("input[name='selectBox']").on("click",function(){
                defaultSetting.update.call($(this).parent().parent());
            });
            this.append(newDiv);
            let _this = this;
            newDiv.find(".moveEl").hover(
                function(){
                    _this.sortable(
                        { 
                            axis: "y",
                            disabled: false,
                            update: function(){
                                defaultSetting.update.call($(this));
                            }
                        });
                },
                function(){
                    _this.sortable({ disabled: true });
                }
            );
        },
        removeFe: function(){
            let el = $(this).parent().parent();
            $(this).parent().remove();
            defaultSetting.update.call(el);
        },
        updataValue: function(){
            let _this = $(this);
            _this.attr("value",_this.val());
            clearTimeout(defaultSetting.timeOut)
            defaultSetting.timeOut=setTimeout(function (){
                defaultSetting.update.call(_this.parent().parent());
            },300)
        },
    };
    $.fn.dynamicSelection = function(options, callBack) {
        defaultSetting = $.extend(defaultSetting, options);
        defaultSetting.isCN = ($.trim(defaultSetting.language).toUpperCase() == "ZH_CN");

        // init
        if(defaultSetting.iconfont.url){
            $("head").append($(`<link rel="stylesheet" href="${defaultSetting.iconfont.url}">`));
        }
        let initEl = $(`<div class="selectable"></div><span class="addition">${defaultSetting.isCN? defaultSetting.zh_CN.add:defaultSetting.en_US.add}</span>`);
        this.append(initEl);
        let selectableEl = this.find(".selectable");
        let addition = this.find(".addition");
        addition.on("click", function(){
            defaultSetting.insertFe.call(selectableEl);
            defaultSetting.update.call(selectableEl);
        });
        for(let i=1;i<=3;i++){
            defaultSetting.insertFe.call(selectableEl);
        }

        // CallBack
        defaultSetting.update = function(){
            try{
                let data = {};
                this.find(":text").map((index,el) => {
                    data[index] = el.value;
                });
                let selectData = [];
                this.find("input[name='selectBox']:checked + :text").map((index,el) => {
                    selectData.push(el.value);
                });
                callBack(data, selectData);
            }catch(err){
                console.log(err.message);
            }
            
        };
        defaultSetting.update.call(selectableEl);
        return this;
    };
})( jQuery );