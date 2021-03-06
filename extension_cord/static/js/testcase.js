/*
*
*   Copyright (c) 2013, Rearden Commerce Inc. All Rights Reserved.
*
*   Licensed under the Apache License, Version 2.0 (the "License");
*   you may not use this file except in compliance with the License.
*   You may obtain a copy of the License at
*
*       http://www.apache.org/licenses/LICENSE-2.0
*
*   Unless required by applicable law or agreed to in writing, software
*   distributed under the License is distributed on an "AS IS" BASIS,
*   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*   See the License for the specific language governing permissions and
*   limitations under the License.
*
*/
var state = {
    key:-100,
    disabled:false,
    search:false,
    page:1,
    elems:50,

    nameordesc:"",
    asname:"",
    asdescription:"",
    aspriority:"",
    asauthor:"",
    asauto:"",
    asproduct:"",
    asstatus:[],
    bugid:"",
    addedversion:"",
    astype:"",
    asdefaultassignee:"",
    asfeature:"",
    asid:"",
};
var tempstate = {
    teams:[],
};
var testcase = {
    submitTestCase:function ()
    {
        var node = $("#root").dynatree("getActiveNode");
        if (node != null){
            var folder_id = node.data.key;
            window.location.href="/create_test_case?folder_id="+encodeURI(folder_id);
        } else {
            var folder_id = -100;
            window.location.href="/create_test_case?folder_id="+encodeURI(folder_id);
        }
        return false;
    },
    enterSearch:function() {
        state.search = true;
        state.page = 1;
        testcase.updateSearch();
        testcase.reload();
    },
    exitSearch:function() {
        state.search = false;
        state.page = 1;
        testcase.updateSearch();
        testcase.reload();
    },
    enterBulk:function() {
        $("td:nth-child(1),th:nth-child(1)").show();
        $("#bulkUpdate").hide();
        $("#bulkNext").show();
        $("#bulkNext").click( function() {
            var selected=testcase.getSelected();
            // posting test_case IDs with form POST
            var input = $("<input>", { type: "hidden", name: "tc-ids", value: selected }); 
            $('#bulkForm').append($(input));
            $("#form-div").dialog({
                modal: true,
            });
        }); 
    },
    getSelected:function() {
        var selected =[];
        $("input:checkbox:checked").each(function() {
            if ($(this).attr("checked"))
            {
                checked = ($(this).val());
                if (checked != "on")
                {
                    selected.push(checked);
                }
            }
        });
        return selected;
    },
    bulkSelectAll:function(status) {
        $(".checkbox").each(function() {
            $(this).attr("checked", status);
        });
    },
    bulkConfirm:function() {
    $("#dialog-confirm").dialog({
        resizable: false,
        height:160,
        modal: true,
        buttons: {
            "Update all items": function() {
                $.ajax({
                    type: "POST",
                    url: "/test_case/bulk/",
                    cache: false,
                    data: $("#bulkForm").serialize(),
                    success: function() {
                        $("#form-div").dialog("close")
                        window.alert("Successfully Updated!")
                    }
                });
                $(this).dialog("close");
            },
            Cancel: function() {
                $(this).dialog("close");
            }
        }   
        });
    },
    updateSearch:function() {
        if(state.search) {
            $("#enterSearch").hide();
            $("#exitSearch").show();
            $("#folders").hide();
            $("#advancedsearch").show();
            if( $("#searchFormText").val() )
                $(".testcase-list-title").text("Tests containing '" + $("#searchFormText").val() + "'");
            else
                $(".testcase-list-title").text("All Tests");
        } else {
            $("#exitSearch").hide();
            $("#enterSearch").show();
            $("#advancedsearch").hide();
            $("#folders").show();
            $("#searchFormText").val("");
        }
    },
    updateViewDisabled:function() {
        $("#viewDisabled").text(state.disabled?"View Enabled":"View Disabled")
    },
    setFieldsFromState:function() {
        $("#searchFormText").val(state.nameordesc);
        $("#asname").val(state.asname);
        $("#asdescription").val(state.asdescription);
        $("#aspriority").val(state.aspriority);
        $("#asauthor").val(state.asauthor);
        $("#bugid").val(state.bugid)
        $("#addedversion").val(state.addedversion)
        $("#astype").val(state.astype)
        $("#asauto").val(state.asauto);
        $("#asstatus").val(state.asstatus);

        if(tempstate.teams.length) {
            $("#asproduct").empty();
            $("#asproduct").append($("<option>",{ value: "", text: "" }));
            $.each(tempstate.teams, function(index, value){
                $("#asproduct").append($("<option>",{
                    value: value.title.replace(" ","+"),
                    text: value.title
                }));
            }); 
        }
        $("#asproduct").val(state.asproduct);
        $("#asdefaultassignee").val(state.asdefaultassignee);
        $("#asfeature").val(state.asfeature);
        $("#asid").val(state.asid);

        testcase.updateSearch(); 
        testcase.updateViewDisabled();
    },
    setStateFromFields:function() {
        state.nameordesc = $("#searchFormText").val();
        state.asname = $("#asname").val();
        state.asdescription = $("#asdescription").val();
        state.aspriority = $("#aspriority").val();
        state.asauthor = $("#asauthor").val();
        state.bugid = $("#bugid").val();
        state.addedversion = $("#addedversion").val();
        state.astype = $("#astype").val();
        state.asauto = $("#asauto").val();
        state.asproduct = $("#asproduct").val();
        state.asstatus = $("#asstatus").val();
        state.asdefaultassignee = $("#asdefaultassignee").val();
        state.asfeature = $("#asfeature").val();
        state.asid = $("#asid").val();
    },
    deserialize:function() {
        var allVars = $.getUrlVars();
        state.key = allVars['key']?allVars['key']:-100;
        state.disabled = 'true' === allVars['disabled'];
        state.search = 'true' === allVars['search'];
        state.page = allVars['page']?allVars['page']:1;
        state.elems = allVars['elems']?allVars['elems']:50;

        state.nameordesc = allVars['nameordesc'] || "";
        state.asname = allVars['asname'] || "";
        state.asdescription = allVars['asdescription'] || "";
        state.aspriority = allVars['aspriority'] || "";
        state.asauthor = allVars['asauthor'] || "";
        state.asauto = allVars['asauto'] || "";
        state.asproduct = allVars['asproduct'] || "";
        if (allVars['asstatus']) {
            state.asstatus = allVars['asstatus'].split(',');
        } else {
            state.asstatus = [];
        }
        state.bugid = allVars['bugid'] || "";
        state.addedversion = allVars['addedversion'] || "";
        state.astype = allVars['astype'] || "";
        state.asdefaultassignee = allVars['asdefaultassignee'] || "";
        state.asfeature = allVars['asfeature'] || "";
        state.asid = allVars['asid'] || "";

        testcase.setFieldsFromState();
    },
    serialize:function() {
        var copystate = {};
        testcase.setStateFromFields();

        if(state.key!=-100) copystate.key = state.key;
        if(state.disabled) copystate.disabled = true;
        if(state.search) copystate.search = true;
        if(state.page != 1) copystate.page = state.page;
        copystate.elems = state.elems;

        if(state.nameordesc.length) copystate.nameordesc = state.nameordesc;
        if(state.asname.length) copystate.asname = state.asname;
        if(state.asdescription.length) copystate.asdescription = state.asdescription;
        if(state.aspriority.length) copystate.aspriority = state.aspriority;
        if(state.asauthor.length) copystate.asauthor = state.asauthor;
        if(state.asauto.length) copystate.asauto = state.asauto;
        if(state.asproduct.length) copystate.asproduct = state.asproduct;
        if(state.bugid.length) copystate.bugid = state.bugid;
        if(state.addedversion.length) copystate.addedversion = state.addedversion;
        if(state.astype.length) copystate.astype = state.astype;
        if(state.asdefaultassignee.length) copystate.asdefaultassignee = state.asdefaultassignee;
        if(state.asfeature.length) copystate.asfeature = state.asfeature;
        if(state.asstatus) { 
            copystate.asstatus = "";
            for (var i=0; i<state.asstatus.length; i++) {
                copystate.asstatus += state.asstatus[i];
                copystate.asstatus += ",";
            }
            if (copystate.asstatus.length) {
                copystate.asstatus = copystate.asstatus.slice(0,-1);
            }
        }
        if(state.asid.length) copystate.asid = state.asid;

        if(state.planid) copystate.planid = state.planid;
        if(state.add) copystate.add = true;

        return $.param(copystate)
    },
    onFolderChange:function() {
        state.key = $("#root").dynatree("getActiveNode").data.key;
        $(".testcase-list-title").text(foldertree.folderName);
        testcase.reload();
    },
    reload:function() {
        window.History.pushState(
                null, 
                state.search?"Tests: Search":"Tests: " + foldertree.folderName, 
                "?" + testcase.serialize() );
    },
    initialize:function() {

        $("#asForm").submit( function() { $("#searchFormText").val(""); testcase.enterSearch(); } );
        $("#searchForm").submit( function() { $('#asForm')[0].reset(); testcase.enterSearch();} );
        $("#enterSearch").click( function(event) { event.preventDefault(); testcase.enterSearch(); } );
        $("#exitSearch").click( function(event) { event.preventDefault(); testcase.exitSearch(); } );
        $("#bulkUpdate").click( function(event) { event.preventDefault(); testcase.enterBulk(); } );
        
        // when view disabled link is clicked, switch between displaying disabled cases
        $("#viewDisabled").click(function(event){ 
            event.preventDefault();
            state.disabled = !state.disabled; 
            testcase.updateViewDisabled(); 
            state.page = 1; 
            testcase.reload();
        });
        
        $(".ajaxPaginate").live('click',function(event){
            event.preventDefault();
            state.page = $(this).attr("value");
            testcase.reload();
        });

        $(".dropdown-menu a").live('click', function(event){
            event.preventDefault();
            state.elems = $(this).attr("value");
            testcase.reload();
        });

        $("#searchForm").show();
        testcase.deserialize();
    }
};
