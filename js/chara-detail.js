    $.holdReady(true);
    var db = {};
    var d0 = $.getJSON("json/excel/building_data.json",function(data){
            db["manufactformulas"] = data.manufactFormulas;
        });
    var d1 = $.getJSON("json/excel/building_data.json",function(data){
            db["workshopformulas"] = data.workshopFormulas;
        });
    var d2 = $.getJSON("json/excel/character_table.json",function(data){
            db["chars"] = data;
        });
    var d3 = $.getJSON("json/excel/item_table.json",function(data){
            db["items"] = data.items;
        });
    var d4 = $.getJSON("json/tl-akhr.json",function(data){
            db["chars2"] = data;
        });
    var d5 = $.getJSON("json/tl-type.json",function(data){
            db["classes"] = data;
        });
    var d6 = $.getJSON("json/tl-tags.json",function(data){
            db["tags"] = data;
        });
    var d7 = $.getJSON("json/tl-item.json",function(data){
            db["itemstl"] = data;
        });
    var d8 = $.getJSON("json/excel/gamedata_const.json",function(data){
            db["dataconst"] = data;
        });
    var d9 = $.getJSON("json/excel/skin_table.json",function(data){
            db["skintable"] = data;
        });
    var d10 = $.getJSON("json/tl-gender.json",function(data){
            db["gender"] = data;
        });
    var d11 = $.getJSON("json/excel/skill_table.json",function(data){
            db["skills"] = data;
        });
    var d12 = $.getJSON("json/dragonjet/skills.json",function(data){
            db["skillsTL"] = data;
        });
    var d13 = $.getJSON("json/excel/range_table.json",function(data){
            db["range"] = data;
        });
    var d14 = $.getJSON("json/tl-attacktype.json",function(data){
            db["attacktype"] = data;
        });
    $.when(d0,d1,d2,d3,d4,d5,d6,d7,d8,d9,d10,d11,d12,d13,d14).then(function(){
        $.holdReady(false);
    });

    var lang;
    var reg;
    var selectedOP;

    $(document).ready(function(){
        $('#to-tag').click(function(){      // When arrow is clicked
            $('body,html').animate({
                scrollTop : 0                       // Scroll to top of body
            }, 500);
        });

        $(window).click(function() {
            $('#operatorsResult').html("");
            $('#operatorsResult').hide();
        });
        $('#operatorsResult').click(function(event){
            event.stopPropagation();
        });
        $('#opBrowseButton').click(function(event){
            event.stopPropagation();
        });
        $('#opname').click(function(event){
            event.stopPropagation();
        });

        if(typeof localStorage.gameRegion === "undefined" || localStorage.gameRegion == ""|| localStorage.webLang == ""){
            console.log("game region undefined");
            localStorage.setItem("gameRegion", 'cn');
            localStorage.setItem("webLang", 'en');
            reg = "cn";
            lang = "en";

            var vars = getUrlVars();
            if(typeof vars.opname != "undefined"){
                // console.log("TEST1")
            }
        } else {
            console.log(localStorage.webLang);
            reg = localStorage.gameRegion;
            lang = localStorage.webLang;
        }
        if(typeof localStorage.selectedOPDetails === "undefined" || localStorage.selectedOPDetails == ""){
            console.log("selected OP undefined");
            var vars = getUrlVars();
            if(typeof vars.opname != "undefined"){
                vars.opname = decodeURIComponent(vars.opname);
                console.log(vars.opname);
                var char = query(db.chars,"appellation",vars.opname,true,true);
                var opname;
                $.each(char,function(key,v){
                    opname = v.name;
                });
                selectOperator(opname);
            } else {
                localStorage.setItem("selectedOP","");
            }
        } else {
            console.log("selected OP defined");
            var curpath = window.location.search.split("?");
            // console.log(curpath)
            if(typeof curpath[1] != "undefined"){
                var variables = curpath[1].split("?");
                var char = {};
                $.each(variables,function(_,v){
                    var subvar = v.split("=");
                    if(subvar[0] == "opname"){
                        var opname = decodeURIComponent(subvar[1]);
                        char = query(db.chars,"appellation",opname.replace(/_/g," "),true,true);
                    }
                });
                var opname;
                $.each(char,function(key,v){
                    opname = v.name;
                })
            } else {
                selectedOP = localStorage.selectedOPDetails;
                var opname = db.chars[selectedOP].name;
            }
            selectOperator(opname);
        }

        // console.log("TEST")
        $('.reg[value='+reg+']').addClass('selected');
        $('.lang[value='+lang+']').addClass('selected');

        //getSkillDesc('skchr_amiya_2',0);
    });

    function clickBtnClear(){
        $("#chara-detail-container").hide();
        $("#elite-sidenav").html("");
        $("#tabs-opCG").html("");
        $("#elite-topnav").html("");
        $("#tabs-opData").html("");
        $("#op-taglist").html("");
        $("#opname").val("");
        $('#operatorsResult').html("");
        $('#operatorsResult').hide();
        localStorage.selectedOPDetails = "";
        history.pushState(null, '', window.location.pathname); 
    }

    function populateOperators(el){
        // console.log(el)
        if(($('#operatorsResult').css("display") == "block") && el=="Browse"){
            // console.log($('#operatorsResult').css("display") == "none" )
            $('#operatorsResult').hide();
            return;
        }
        if(el.value != ""||el=="Browse"){
            var result = [];
            $.each(db.chars2,function(_,char){
                var languages = ['cn','en','jp','kr'];
                var found = false;
                if(el=="Browse"){
                    
                    found=true;
                }else{
                    for (var i = 0; i < languages.length; i++) {
                        var charname = eval('char.name_'+languages[i]).toUpperCase();
                        var input = el.value.toUpperCase();
                        var search = charname.search(input);
                        if(search != -1){
                            found = true;
                            break;
                        };
                    }
                }
                if(found){
                    // console.log(char)
                    var name_cn = char.name_cn;
                    var name = eval('char.name_'+reg);
                    var nameTL = eval('char.name_'+lang);
                    var img_name = query(db.chars,"name",char.name_cn,true,true); 
                    // console.log(Object.keys(img_name))
                    var rarity = img_name[Object.keys(img_name)] ? img_name[Object.keys(img_name)].rarity + 1 : 0;
                    // console.log(rarity);
                    if(rarity!=0)
                    result.push({'name':name,'name_cn':name_cn,'nameTL':nameTL,'img_name':Object.keys(img_name),rarity});
                }
            });
            // console.log(result)
            result.sort((a,b)=> b.rarity-a.rarity)
            if(result.length > 0){
                $('#operatorsResult').html("");
                $('#operatorsResult').show();
                for (var i = 0; i < result.length; i++) {
                    let image = `<img style="height:40px;padding:2px" src="./img/avatars/${result[i].img_name}_1.png">  `
                    // console.log(image)
                    if(el=="Browse"){
                        image = `<img style="height:70px;padding:2px" src="./img/avatars/${result[i].img_name}_1.png">  `
                        $("#operatorsResult").css("max-width","100vw");
                        $("#operatorsResult").append(
                                "<li class=\"col-2 col-sm-1 ak-shadow-small ak-rare-"+result[i].rarity+"\"style=\"display:inline-block;cursor: pointer;width:75px;margin:2px;margin-bottom:2px;padding:1px;border-radius:2px\" onclick=\"selectOperator('"+result[i].name_cn+"')\">"
                                +"<div style=\"white-space: nowrap;padding:0px;text-align:center;margin:0 \">"+image+"</div>"
                                +"<div style=\"white-space: nowrap;padding:0px;text-align:center;margin:0 \">"+result[i].nameTL+"</div>"
                                +"</li>");
                    }else{
                        $("#operatorsResult").css("max-width","290px");
                        $("#operatorsResult").append("<li class=\" ak-shadow-small ak-rare-"+result[i].rarity+"\"style=\"width:100%;cursor: pointer;margin-bottom:2px\" onclick=\"selectOperator('"+result[i].name_cn+"')\">"+image+result[i].nameTL+" ("+result[i].name+")"+"</li>");
                    }
                }
            }
            // console.log( $("#operatorsResult")  )
            // $('#operatorsResult').show();
        } else {
            $('#operatorsResult').html("");
            $('#operatorsResult').hide();
        }
    }

    function selectOperator(opname){
        if(opname != ""){
            $("#chara-detail-container").show();
            console.log("SELECT OPERATOR");
            console.log(opname);   
            $("#opname").val("");
            $('#operatorsResult').html("");
            $('#operatorsResult').hide();
            var opdata = query(db.chars2,"name_cn",opname);
            var opclass = query(db.classes,"type_cn",opdata.type);
            var opdata2 = query(db.chars,"name",opdata.name_cn,true,true);
            var opdataFull = {};

            $.each(opdata2,function(key,v){
                v['id'] = key;
                // console.log(v);
                opdataFull = v;
                localStorage.selectedOPDetails = key;
                return false
            });
            
            var curpath = window.location.pathname.split("?");
            history.pushState(null, '', curpath+'?opname='+opdataFull.appellation.replace(/ /g,"_")); 


            // use opdata to get the operator data based on tl-akhr.json
            // use opdataFull to get the operator data based on character_table.json

            // Get operator elite skins
            var skinList = db.skintable.buildinEvolveMap[opdataFull.id];
            // console.log(skinList);
            $("#op-faction").attr("src","img/factions/"+opdataFull.displayLogo+".png");

            var tabbtn = [];
            var tabbtn2 = [];
            var tabcontent = [];
            var tabcontent2 = [];
            
            $("#elite-sidenav").html("");
            $("#tabs-opCG").html("");
            $("#elite-topnav").html("");
            $("#tabs-opData").html("");
            $("#op-taglist").html("");

            for (var i = 0; i < opdataFull.phases.length; i++) {
                var l = opdataFull.phases.length;
                if(i == 0){
                    if(l == 1){
                        tabbtn[l] = $("<li class='nav-item'><button class='btn tabbing-btns active'>"
                            + "<img src='img/ui/elite/0-s.png' data-toggle='pill' href='#opCG_0_tab'></button></li>");
                        tabbtn2[i] = $("<li class='nav-item'><a class='btn tabbing-btns horiz-small nav-link active' data-toggle='pill' href='#elite_0_tab'>Non-Elite</a></li>");
                    } else {
                        tabbtn[l] = $("<li class='nav-item'><button class='btn tabbing-btns tabbing-btns-bottom active' data-toggle='pill' href='#opCG_"+i+"_tab'>"
                                            + "<img src='img/ui/elite/0-s.png'></button></li>");
                        tabbtn2[i] = $("<li class='nav-item'><a class='btn tabbing-btns horiz-small nav-link active' data-toggle='pill' href='#elite_"+i+"_tab'>Non-Elite</a></li>");
                    }
                } else if( i == l-1 ){
                    tabbtn[0] = $("<li class='nav-item'><button class='btn tabbing-btns tabbing-btns-top' data-toggle='pill' href='#opCG_"+i+"_tab'>"
                                            + "<img src='img/ui/elite/"+i+"-s.png'></button></li>");
                    tabbtn2[i] = $("<li class='nav-item'><a class='btn tabbing-btns horiz-small nav-link' data-toggle='pill' href='#elite_"+i+"_tab'>Elite "+i+"</a></li>");
                } else {
                    tabbtn[l-i] = $("<li class='nav-item'><button class='btn tabbing-btns tabbing-btns-middle' data-toggle='pill' href='#opCG_"+i+"_tab'>"
                                            + "<img src='img/ui/elite/"+i+"-s.png'></button></li>");
                    tabbtn2[i] = $("<li class='nav-item'><a class='btn tabbing-btns horiz-small nav-link' data-toggle='pill' href='#elite_"+i+"_tab'>Elite "+i+"</a></li>");
                }

                var skindata;
                if(!(skinList[i] in db.skintable.charSkins)){
                    skindata = db.skintable.charSkins[skinList[i-1]];
                } else {
                    skindata = db.skintable.charSkins[skinList[i]];
                }

                if(i == 0){
                    tabcontent.push($("<div class='tab-pane container active' id='opCG_0_tab'>"
                        +"<img class='chara-image' src='img/characters/"+skindata.portraitId+".png'>"
                        +"</div>"));
                } else {
                    tabcontent.push($("<div class='tab-pane container fade' id='opCG_"+i+"_tab'>"
                        +"<img class='chara-image' src='img/characters/"+skindata.portraitId+".png'>"
                        +"</div>"));
                }

                var elitehtml = getEliteHTML(i,opdataFull);
                tabcontent2.push(elitehtml);

                $("#elite-sidenav").html(tabbtn);
                $("#tabs-opCG").html(tabcontent);
                $("#elite-topnav").html(tabbtn2);
                $("#tabs-opData").html(tabcontent2);
            }

            $("#op-nameTL").html(eval("opdata.name_"+lang));
            $("#op-nameREG").html("["+eval("opdata.name_"+reg)+"]");
            var gender = query(db.gender,"sex_cn",opdata.sex);

            $("#op-gender").html(titledMaker(eval("gender.sex_"+lang),`Gender`))
            var position = query(db.tags,"tag_cn",opdataFull.position);
            $("#op-position").html(titledMaker(eval("position.tag_"+lang),`Position`))

            var type = query(db.classes,"type_cn",opdata.type);
            $("#op-classImage").attr("src","img/classes/black/icon_profession_"+eval("type.type_"+lang).toLowerCase()+"_large.png")

            var attackType = getSpeciality(opdataFull.description)
            var attackTypeTl =  query(db.attacktype,"type_cn",attackType);
            // console.log(attackType)
            // console.log(attackTypeTl)
            
            $("#op-atktype").html(titledMaker((eval("attackTypeTl.type_"+lang)?eval("attackTypeTl.type_"+lang):attackType),`Traits`,`ak-trait-${(eval("attackTypeTl.type_detail"))}`))

            $("#op-rarity").html("");
            $("#op-rarity").attr("class","op-rarity-"+opdata.level)
            for (var i = 0; i < opdata.level; i++) {
                $("#op-rarity").append("<i class='fa fa-star'></i>");
            }

            var tags_html = [];
            $.each(opdataFull.tagList,function(_,v){
                var tag = query(db.tags,"tag_cn",v);
                if(tag){
                    var tagReg = eval('tag.tag_'+reg);
                    var tagTL = eval('tag.tag_'+lang);
                    tags_html.push("<li style=\"list-style-type:none; padding-bottom: 10px;\"><button readonly type=\"button\" class=\"btn btn-sm ak-shadow-small ak-btn btn-secondary btn-char my-1\" data-toggle=\"tooltip\" data-placement=\"top\" title=\""+ tagReg +"\">" +
                            (tagReg == tagTL ? "" : '<a class="ak-subtitle2" style="font-size:11px;margin-left:-9px;margin-bottom:-15px">'+tagReg+'</a>') +tagTL + "</button></li>");
                }
            });
            $("#op-taglist").append(tags_html);

            ///////////////////////////////////////////////// SKILLS SECTION //////////////////////////////////////////////////

            $("#skill-tabs").html("");
            $("#skill-contents").html("");
            $.each(opdataFull.skills,function(i,v){
                var maxSkillLevel = opdataFull.skills[i].levelUpCostCond.length;
                var skillId = opdataFull.skills[i].skillId;
                var skillData = db.skills[skillId];
                var skillname = db.skillsTL[skillId].name;
                var tables = "";
                var grid = ""
                console.log(skillData)
                // var materialList2 = []
                $.each(skillData.levels,function(i2,v2){
                    // console.log(v2['spData'].spCost);
                    var skilldesc = getSkillDesc(skillId,i2);
                    var skillMat = GetSkillCost(i2,i,opdataFull)
                    var force
                    var materialist = []
                    skillMat.forEach(mat => {
                        materialist.push(CreateMaterial(mat.id,mat.count))
                    });
                    var materialHtml =``
                    if(i2>=7){
                        var time = opdataFull.skills[i].levelUpCostCond[i2-7].lvlUpTime
                        var condLeveling = opdataFull.skills[i].levelUpCostCond[i2-7].unlockCond
                        var condUnlocking = opdataFull.skills[i].unlockCond
                        var phase = Math.max(condLeveling.phase,condUnlocking.phase)
                        var level = Math.max(condLeveling.level,condUnlocking.level)
                        materialHtml = `
                        <div style="text-align:center;background:#222">${(i2==0?"Unlock":"Rank Up")} Requirements</div>
                        <div style="margin-top:15px">
                        ${titledMaker((phase>0?"Elite "+phase+" ":"")+(level>0?"Level "+level:""),"Level Required")}
                        ${titledMaker(time/60/60+" Hour","Time Required")}
                        </div>
                        `+(materialist.length>0?materialist.join(""):"")
                    }else{
                        var condLeveling = (opdataFull.allSkillLvlup[i2-1]?opdataFull.allSkillLvlup[i2-1].unlockCond:{phase:0,level:0})
                        var condUnlocking = opdataFull.skills[i].unlockCond
                        var phase = Math.max(condLeveling.phase,condUnlocking.phase)
                        var level = Math.max(condLeveling.level,condUnlocking.level)
                        materialHtml = `
                        <div style="text-align:center;background:#222">${(i2==0?"Unlock":"Rank Up")} Requirements</div>
                        <div style="margin-top:15px">
                        ${titledMaker((phase>0?"Elite "+phase+" ":"")+(level>0?"Level "+level:""),"Level Required")}
                        </div>
                        `+(materialist.length>0?materialist.join(""):"")
                    }
                    
                    if(v2.rangeId)grid = rangeMaker(v2.rangeId)
                    var spType = (v2.spData.spType)
                    console.log(spType)
                    var spTypeHtml = ""
                    switch (spType){
                        case 1:spTypeHtml = "Per second";break;
                        case 2:spTypeHtml = "Attacking Enemy";break;
                        case 4:spTypeHtml = "Getting Hit";break;
                        case 8:spTypeHtml = "Always On";break;
                        default:spTypeHtml = spType;break;
                    }
                    var spDuration= (v2.duration==0?"Instant Use":v2.duration)
                    var spDurationName = "Duration"

                    skillData.levels[i2].blackboard.forEach(skillinfo => {
                        if(skillinfo.key=="force") force= skillinfo.value
                        if(v2.duration==-1){
                            // spDuration =
                        }
                    });
                    
                    var extraInfoHtml =``
                    // console.log(materialList2)
                    // console.log(parseInt(v2.duration)>0)
                    //skilltype 
                    //0 = on deploy
                    //1 = manual 
                    //2 = auto
                    if(grid){
                        tables += "<table id='skill"+i+"level"+i2+"stats' class='skillstats "+(i2!=0 ? '' : 'active')+"'>"
                                +            "<tr>"
                                +                "<td colspan='3'  class='skilldesc'>"+skilldesc+"</td>"
                                +            "</tr>"
                                +            "<tr style=\"height:20px\"></tr>"
                                +            "<tr>"
                                +               "<td rowspan=3>"+(grid?grid:"")+"</td>"
                                +                `<td>${titledMaker(v2['spData'].spCost,"SP Cost")}</td>`
                                +                `<td>${titledMaker(v2['spData'].initSp,"Initial SP")}</td>`
                                
                                +            "</tr>"
                                +            "<tr>"
                                +                `<td>${titledMaker(spDuration,spDurationName)}</td>`
                                +                `<td>${titledMaker(spTypeHtml,"SP Charge Type")}</td>`
                                +            "</tr>"
                                +             "<tr><td>"+(force!=undefined?`${titledMaker(force,"Force Level")}`: "")+"</td></tr>"
                                + "<tr><td colspan=3>"+ materialHtml + "</td><tr>"
                                +        "</table>";   
                    } else {
                        tables += "<table id='skill"+i+"level"+i2+"stats' class='skillstats "+(i2!=0 ? '' : 'active')+"'>"
                                +            "<tr>"
                                +                "<td colspan='4' class='skilldesc'>"+skilldesc+"</td>"
                                +            "</tr>"
                                +            "<tr style=\"height:20px\"></tr>"
                                +            "<tr>"
                                +                `<td>${titledMaker(v2['spData'].initSp,"Initial SP")}</td>`
                                +                `<td>${titledMaker(v2['spData'].spCost,"SP Cost")}</td>`
                                
                                +            "</tr>"
                                +                `<td>${titledMaker(spTypeHtml,"SP Charge Type")}</td>`
                                +             (force!=undefined?`<tr><td>${titledMaker(force,"Force Level")}</td></tr>`: "")
                                +                `<td>${titledMaker(spDuration,spDurationName)}</td>`
                                + "<tr><td colspan=4>"+ materialHtml + "</td><tr>"
                                +        "</table>";
                    }
                })

                if(skillData.iconId == null){
                    var skillIcon = skillId;
                } else {
                    var skillIcon = skillData.iconId;
                }

                var tabItem = $("<li class='nav-item'>"
                                +    "<button class='btn tabbing-btns horiz-small nav-link "+(i!=0 ? '' : 'active')+"' data-toggle='pill' href='#skill"+i+"'><p>Skill "+(i+1)+"</p></button>"
                                +"</li>");
                var tabContents = $("<div class='tab-pane container clickthrough "+(i!=0 ? 'fade' : 'active')+"' id='skill"+i+"'>"
                                        +    "<div class='small-container ak-shadow' style='margin-top: 50px;'>"
                                        +        "<p>Skill "+(i+1)+"</p>"
                                        +        "<span class='skillname'>"+skillname+"</span>"
                                        +        "<div class='topright'>"
                                        +            "<div style='padding: 15px;'>"
                                        +                "<img class='ak-shadow skill-image' id='skill"+i+"image' src='img/skills/skill_icon_"+skillIcon+".png' style='width: 100%;'>"
                                        +            "</div>"
                                        +        "</div>"
                                        +        "<button class='btn btn-default btn-collapsible notclickthrough' data-toggle='collapse' data-target='#skill"+i+"StatsCollapsible'><i class='fa fa-sort-down'></i></button>"
                                        +    "</div>"
                                        +    "<div id='skill"+i+"StatsCollapsible' class='collapse collapsible notclickthrough ak-shadow collapse show' >"
                                        +       "<input type='range' value='1' min='1' max="+skillData.levels.length+" name='skillLevel' id='skill"+i+"Level' oninput='changeSkillLevel(this,"+i+")'style=\"margin-top:20px;\" class='skillLevelInput'>"
                                        +        `<div class='skillleveldisplaycontainer'><span class="ak-btn btn btn-sm ak-c-black" id='skill${i}LevelDisplay'>${SkillRankDisplay(1)}</span></div>`
                                        // +        `<div style="position:absolute"style="bottom:0px;right:0px">Level</div>`
                                        +        tables
                                        +    "</div>"
                                        +"</div>");
                $("#skill-tabs").append(tabItem);
                $("#skill-contents").append(tabContents);
            });
        }
    }

    function getEliteHTML(i, opdataFull){
        var container = $("<div class='tab-pane container "+(i!=0 ? 'fade' : 'active')+"' id='elite_"+i+"_tab'></div>");

        var stats = $("<div class='small-container ak-shadow clickthrough'>"
                        +   "<p>Base</p>"
                        +   "<span>Stats</span>"
                        +   "<div class='topright maxlevel'>"
                        +       "<span class='maxleveltext'>Max Level</span>"
                        +       "<span class='leveltext'>"+opdataFull.phases[i].maxLevel+"</span>"
                        +       "<div class='ring'>"
                        +           "<div class='back ak-shadow'></div>"
                        +           "<div class='back-centre'></div>"
                        +       "</div>"
                        +   "</div>"
                        +"<button class='btn btn-default btn-collapsible notclickthrough' data-toggle='collapse' data-target='#elite"+i+"StatsCollapsible'><i class='fa fa-sort-down'></i></button>"
                        +"</div>");

        var statsCollapsible = $("<div id='elite"+i+"StatsCollapsible' class='collapse collapsible eliteStatsContainer ak-shadow collapse show'></div>");
        var eliteCost = GetEliteCost(i,opdataFull)
        var materialist = []
        
        if(eliteCost){
            eliteCost.forEach(materials => {
                materialist.push(CreateMaterial(materials.id,materials.count))
            });
            // console.log(materialist)
        }
        var materialHtml =''
        if(materialist.length>0){
            materialHtml=`
            <div style="text-align:center;background:#222">Elite Requirements</div>
            `+materialist.join("")
        }
        var navPills = $("<ul class='nav nav-pills'></ul>");
        var navTabs = $("<div class='tab-content'>");

        $.each(opdataFull.phases[i].attributesKeyFrames,function(j,v){
            var keyframe = opdataFull.phases[i].attributesKeyFrames[j];
            // console.log(keyframe)
            var navItems = $("<li class='nav-item'>"
                            +   "<a class='btn tabbing-btns horiz nav-link "+(j!=0 ? '' : 'active')+"' data-toggle='pill' href='#elite"+i+"Stats"+j+"'>lv "+keyframe.level+"</a>"
                            +"</li>");
            if(keyframe.data["respawnTime"] >= 100){
                var deploy = "Slow";
            } else if(keyframe.data["respawnTime"] < 100 && keyframe.data["respawnTime"] >= 30){
                var deploy = "Medium";
            } else {
                var deploy = "Fast";
            }
            var tabStats = $("<div class='tab-pane container "+(j!=0 ? 'fade' : 'active')+"' id='elite"+i+"Stats"+j+"'>"
                            +   "<table id='elite"+i+"Stats"+j+"Table'>"
                            +       "<tr>"
                            +           "<td class='stats-l'>MaxHP :</td><td class='stats-r'>"+keyframe.data["maxHp"]+"</td>"
                            +           "<td class='stats-l'>Def :</td><td class='stats-r'>"+keyframe.data["def"]+"</td>"
                            +       "</tr>"
                            +       "<tr>"
                            +           "<td class='stats-l'>Atk :</td><td class='stats-r'>"+keyframe.data["atk"]+"</td>"
                            +           "<td class='stats-l'>MRes :</td><td class='stats-r'>"+keyframe.data["magicResistance"]+"</td>"
                            +       "</tr>"
                            +       "<tr>"
                            +           "<td colspan=2 rowspan=4>"+rangeMaker(opdataFull.phases[i].rangeId)+"</td>"
                            +           "<td class='stats-l'>Redeploy :</td><td class='stats-r'>"+keyframe.data["respawnTime"]+" Sec</td>"
                            +       "</tr>"
                            +       "<tr>"
                            +           "<td class='stats-l'>Cost :</td><td class='stats-r'>"+keyframe.data["cost"]+"</td>"
                            +       "</tr>"
                            +       "<tr>"
                            +           "<td class='stats-l'>Block :</td><td class='stats-r'>"+keyframe.data["blockCnt"]+"</td>"
                            +       "</tr>"
                            +       "<tr>"
                            +           "<td class='stats-l'>AtkTime :</td><td class='stats-r'>"+keyframe.data["baseAttackTime"]+" Sec</td>"
                            +       "</tr>"
                            // +       "<tr></tr>"
                            +       "<tr><td colspan=4>"
                            +       materialHtml
                            +       "</td></tr>"
                            +   "</table></div>");
            navPills.append(navItems);
            navTabs.append(tabStats);
        });
        statsCollapsible.append(navPills);
        statsCollapsible.append(navTabs);

        if(i > 0){
            var mats = $("<div class='small-container ak-shadow'>"
                        +   "<p>Elite "+i+"</p>"
                        +   "<span>Required materials</span>"
                        +   "<img class='topright' src='img/ui/elite/"+i+".png' width='100'>"
                        +   "<button class='btn btn-default btn-collapsible' data-toggle='collapse' data-target='#elite"+i+"MatsCollapsible'><i class='fa fa-sort-down'></i></button>"
                        +   "<div id='elite"+i+"MatsCollapsible' class='collapse collapsible'>"
                        +    materialist.join("")
                        +   "</div></div>");
        } else {
            var mats = $("");
        }
        container.append(stats);
        container.append(statsCollapsible);
        // container.append(mats);
        return container;
    }

    function GetSkillCost(i2,i, opdataFull){
        let reqmats=[]
        // console.log("==============="  )
        // console.log("Skill Number :" + (i+1)  )
        // console.log("Skill Level :" + (i2+1)  )
        // console.log("Skill mastery :" + (i2-7+1)  )
        
        if(i2!=0&&i2<7){
            // console.log(opdataFull.allSkillLvlup[i2])
            reqmats = opdataFull.allSkillLvlup[i2-1].lvlUpCost
        
        }else if(i2>=7){
            // console.log(opdataFull.skills[i])
            reqmats = opdataFull.skills[i].levelUpCostCond[i2-7].levelUpCost
        }
        // console.log(i2 + " wa " + i)
        // console.log(reqmats)
        return reqmats
    }
    function GetEliteCost(i,opdataFull){
        if(i>0){
            console.log(opdataFull)
            let reqmats = [];
            // console.log(db.dataconst["evolveGoldCost"][opdataFull.rarity])
            // console.log(i)
            if(reqmats){
                if(opdataFull.phases[i]){
                    // console.log(curChara.rarity+1)
                    // console.log(db.dataconst["evolveGoldCost"][curChara.rarity][num-1])
                    reqmats=([{"count":(db.dataconst["evolveGoldCost"][opdataFull.rarity][i-1]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                                , "id" :4001
                                ,"type":"GOLD" }])
                }
            }
            reqmats = opdataFull.phases[i] ? reqmats.concat(opdataFull.phases[i].evolveCost) : undefined;
            // console.log(reqmats)
            return reqmats
        }else{
            return undefined
        }
    }
    function CreateMaterial(id,count){
        var itemdata = db.items[id];
        var itemdataTL = query(db.itemstl,"name_cn",itemdata.name);
        var material = 
        ("<div class=\"akmat-container\" style=\"position: relative;\">"
        +           "<div class=\"item-name\">"+(itemdataTL.name_en?itemdataTL.name_en:itemdata.name)+"</div>"
        +           "<div class=\"item-image\">"
        +               "<span></span>"
        +               "<img id=\"item-image\" src=\"img/items/"+itemdata.iconId+".png\">"
        +           "</div>"
        +           "<img class=\"item-rarity\" src=\"img/material/bg/item-"+(itemdata.rarity+1)+".png\">"
        +           "<div class=\"item-amount\">"+count+"x</div>"
        +       "</div>");

        return material
    }
    function getSpeciality(description){
        // console.log(description)
        let muhRegex = /<@ba\.kw>(.*?)<\/>/g
        let currSpeciality = muhRegex.exec(description)
        console.log(currSpeciality)
        if(currSpeciality)
        return currSpeciality[1]
        else
        return "None"
    }

    function titledMaker (content,title,extraClass="",extraId=""){
        let titledbutton = `
        <div class=\"ak-btn-non btn-sm ak-shadow-small ak-btn ak-btn-bg btn-char my-1 ${extraClass}\" style="" data-toggle=\"tooltip\" data-placement=\"top\" id="${extraId}">
        <a class="ak-subtitle2" style="font-size:11px;margin-left:-9px;margin-bottom:-15px">${title}</a>${content}</div>`

        return titledbutton
    }
    function rangeMaker(rangeId){
        let rangeData = db.range[rangeId]
        if(rangeData){
            let minRow = 0
            let minCol = 0
            let maxRow = 0
            let maxCol = 0
            let table = []
            let grids = []
            // console.log(rangeData.grids)
            if(rangeData){
                rangeData.grids.forEach(element => {
                    maxRow = Math.max(maxRow,element.row)
                    maxCol = Math.max(maxCol,element.col)
                    minRow = Math.min(minRow,element.row)
                    minCol = Math.min(minCol,element.col)
                });
            }
            table.push(`<div class="rangeTableContainer"><table class='rangeTable' style="table-layout: fixed;border-spacing:0 15px;padding:4px; border-collapse:separate; border-spacing:2px;width:${(maxCol+minCol+1)*17}px;">`)
            
            for(r=0;r+minRow<maxRow+1;r++){
                table.push(`<tr style="height:17px">`)
                // console.log(r+minRow)
                for(c=0;c+minCol<maxCol+1;c++){
                    table.push(`<td style=";width:17px`)
                    if(r+minRow==0&&c+minCol==0){
                        table.push(";background:#DDD")
                    }else{
                        rangeData.grids.forEach(element => {
                            if(element.row==r+minRow&&element.col==c+minCol){
                                table.push(";border: 2px solid #DDDDDD88;")
                            }
                        });
                    }
                    
                    table.push(`"></td>`)
                }
            }
            table.push(`</table>`);
            table.push(`<div><span style="all:inherit;">Range</span></div>`);
            return table.join("")
        }else{
            return undefined
        }
        
    }

    function changeSkillLevel(el,skill_no){
        var value = $(el).val();
        $("#skill"+skill_no+"StatsCollapsible").children("table").removeClass("active");
        $("#skill"+skill_no+"level"+(value-1)+"stats").addClass("active");
        $("#skill"+skill_no+"LevelDisplay").html(SkillRankDisplay(value));
    }

    function SkillRankDisplay(skill_no){
        let img = "./img/ui/rank/"
        let html =""
        if(skill_no>0&&skill_no<7){
            img += skill_no+".png"
            html = `<img src="${img}" style="width:40px">`
        }else if(skill_no>=7){
            let imgM = img +"m-"+ (skill_no-7)+".png"
            img += "7.png"
             
            html = `<img src="${img}" style="width:40px"><div class="akrankmastery"><img src="${imgM}" style="width:40px"></div>`
        }
        return html
    }
    
      
    function getSkillDesc(skillId,level){
        var skill = db.skills[skillId].levels[level];
        var skillTL = db.skillsTL[skillId];
        // console.log(skill);
        // console.log(skillTL);

        var desc = skillTL.desc;

        var matches = skillTL.desc.match(/(\{\{(.*?)\}:.0(.)\}|\{(.*?)\})/gm);
        // console.log(matches)
        $.each(matches,function(i,v){
            var submatches = v.match(/(?:(?!\{).(?!:))+/gm);
            if(!submatches[1]){
                submatches = v.match(/(?:(?!\{).(?!$))+/gm);
            }
            // console.log(submatches)
            var value;
            for (var i = 0; i < skill.blackboard.length; i++) {
                if(skill.blackboard[i].key == submatches[0]){
                    value = skill.blackboard[i].value;
                    // console.log(value)
                }
            }
            if(value){
                if(typeof submatches[1] != "undefined"){
                    // console.log(submatches[1])
                    if(submatches[1].includes("%")){
                        value = Math.round((value * 100)) + "%";
                    }
                }
                desc = desc.replace(v,value);
            }
        });
        // console.log(desc);
        return desc;
    }

    function query(db,key,val,single=true,returnKey=false){
        if(single){
            var result = {};
        } else {
            var result = [];
        }
        var found = false;
        $.each(db,function(key2,v){
            if(eval('v.'+key).toLowerCase() == val.toLowerCase()){
                found = true;
                if(single){
                    if(returnKey){
                        result[key2] = v;
                    } else {
                        result = v;
                    }
                    return false;
                } else {
                    if(returnKey){
                        var obj = {};
                        obj[key2] = v; 
                        result.push(obj);
                    } else {
                        result.push(v);
                    }
                }
            }
        });
        if(found){
            return result;
        } else {
            return false;
        }
    }

    function changeUILanguage(){
        reg = localStorage.gameRegion;
        lang = localStorage.webLang;

        $('#display-reg').text(reg.toUpperCase())
        
        switch (lang) {
            case "en":$('#display-lang').text("English");break;
            case "cn":$('#display-lang').text("Chinese");break;
            case "jp":$('#display-lang').text("Japanese");break;
        }
        
        localStorage.setItem("gameRegion", reg);
        localStorage.setItem("webLang", lang);
        getJSONdata("ui",function(data){
            if(data.length != 0){
                $.each(data, function(i,text){
                    $("[translate-id="+text.id).html(text['ui_'+lang]);
                });
            }
        });
    }

    function getJSONdata(type, callback){
        var x = 0;
        var req = $.getJSON("json/tl-"+type+".json");
        req.done(function(response){
            callback(response);
        });
        req.fail(function(response){
            console.log("type: "+type+" fail: ");
            console.log(response);
        });
    }

    function getUrlVars() {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
            vars[key] = value;
        });
        return vars;
    }