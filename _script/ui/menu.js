import {$div,$link} from "../util/dom.js";
import {COMMAND} from "../enum.js";
import EventBus from "../util/eventbus.js";

let Menu = function(){
    let me = {}
    let container;
    let activeMenu;
    let isMenuActive;

    let items=[
        {label: "File", items:[
                {label: "New", command: COMMAND.NEW},
                {label: "Open", command: COMMAND.OPEN},
                {label: "Save", command: COMMAND.SAVE},
            ]},
        {label: "Edit", items:[
                {label: "Undo", command: COMMAND.UNDO},
                {label: "Redo", command: COMMAND.REDO},
                {label: "Clear"},
            ]},
        {label: "Tools", items:[
                {label: "Draw",command: COMMAND.DRAW},
                {label: "Select",command: COMMAND.SELECT},
                {label: "Line"},
                {label: "Square"}
            ]},
        {label: "Layer", items:[
                {label: "New",command: COMMAND.NEWLAYER}
            ]},
        {label: "Selection", items:[
                {label: "Deselect",command: COMMAND.CLEARSELECTION},
                {label: "To Stencil",command: COMMAND.STAMP}
            ]},
        {label: "View", items:[
                {label: "Split Screen",command: COMMAND.SPLITSCREEN}
            ]}
    ]

    me.init = function(parent){
        container = $div("menu","",parent);
        generate();
    }

    me.activateMenu = function(index){
        if(typeof activeMenu === "number" && activeMenu !== index) me.deActivateMenu(activeMenu);

        let item = items[index];
        if (item && item.element){
            item.element.classList.toggle("active");
            if (item.element.classList.contains("active")){
                activeMenu=index;
                isMenuActive=true;
            }else{
                isMenuActive=false;
            }
        }
    }

    me.deActivateMenu = function(index){
        if (typeof index === "undefined") index=activeMenu;

        let item = items[index];
        if (item && item.element){
            item.element.classList.remove("active");
            activeMenu = undefined;
            isMenuActive = false;
        }
    }

    function generate(){
        items.forEach((item,index)=>{
            item.element = $link("main handle",item.label,container,(e) =>{
                me.activateMenu(index);
            });
            item.element.addEventListener("mouseenter",(e)=>{
                if (isMenuActive && activeMenu!==index){
                    me.activateMenu(index);
                }
            })
            if (item.items){
                let sub = $div("sub","",item.element);
                item.items.forEach(subitem=>{
                    $link("handle",subitem.label,sub,(e) =>{
                        if (subitem.command){
                            EventBus.trigger(subitem.command);
                            me.deActivateMenu();
                        }
                    });
                });
            }
        })
    }

    return me;


}();

export default Menu;