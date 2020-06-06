var plugin_ikso_konfirmo = jQuery.cookie('DW_PLUGIN_IKSO_NE_MONTRU_DENOVE');
var plugin_ikso_dialogo_jam_aperis = false;

jQuery(function() {
    if (typeof plugin_ikso_konfirmo === "undefined") {
        // kuketo mankas, enmetu <div>-on kun teksto por la modala dialogo fine de la paĝo
        jQuery(
              '<div id="plugin_ikso__modala_dialogo" title="Avizo" style="display:none;overflow-x:auto">'
            + '<table style="margin:0 auto;border:0px !important">'
            + '<tr>'
            + '<td colspan="6" style="border:0px !important">En iu ajn tekstokampo vi povas tajpi laŭ la "X-kodo":</td>'
            + '</tr>'
            + '<tr>'
            + '<td style="border:0px !important">cx&nbsp;&rarr;&nbsp;ĉ</td>'
            + '<td style="border:0px !important">gx&nbsp;&rarr;&nbsp;ĝ</td>'
            + '<td style="border:0px !important">hx&nbsp;&rarr;&nbsp;ĥ</td>'
            + '<td style="border:0px !important">jx&nbsp;&rarr;&nbsp;ĵ</td>'
            + '<td style="border:0px !important">sx&nbsp;&rarr;&nbsp;ŝ</td>'
            + '<td style="border:0px !important">ux&nbsp;&rarr;&nbsp;ŭ</td>'
            + '</tr>'
            + '<tr>'
            + '<td colspan="6" style="border:0px !important;padding-top:1.5em">Tajpu aldonan ikson por malĉapeligi literon:</td>'
            + '</tr>'
            + '<tr>'
            + '<td style="border:0px !important">ĉx&nbsp;&rarr;&nbsp;cx</td>'
            + '<td style="border:0px !important">ĝx&nbsp;&rarr;&nbsp;gx</td>'
            + '<td style="border:0px !important">ĥx&nbsp;&rarr;&nbsp;hx</td>'
            + '<td style="border:0px !important">ĵx&nbsp;&rarr;&nbsp;jx</td>'
            + '<td style="border:0px !important">ŝx&nbsp;&rarr;&nbsp;sx</td>'
            + '<td style="border:0px !important">ŭx&nbsp;&rarr;&nbsp;ux</td>'
            + '</tr>'
            + '</table>'
            + '</div>'
        ).appendTo('body');
    }

    // kaptu eventojn en ĉiuj tekstokampoj
    jQuery('input[type="text"],textarea').each(function() {

        // fokuso: montru la modalan dialogon se necese
        jQuery(this).focus(function(event) {
            if (typeof plugin_ikso_konfirmo === "undefined" && !plugin_ikso_dialogo_jam_aperis) {
                plugin_ikso_dialogo_jam_aperis = true;
                jQuery("#plugin_ikso__modala_dialogo").dialog({
                    modal: true, resizable: false, width: 'auto', height: 'auto', closeText: 'Fermi',
                    buttons: {

                        // kreu kuketon por ne montri la modalan dialogon dum tuta jaro kaj fermu la dialogon
                        "Mi komprenis, ne montru tion denove": function() {
                            jQuery.cookie('DW_PLUGIN_IKSO_NE_MONTRU_DENOVE', true, {
                                expires: 365,
                                path:    (typeof DOKU_COOKIE_PARAM.path === "undefined"
                                          ? JSINFO.DOKU_COOKIE_PARAM.path : DOKU_COOKIE_PARAM.path),
                                secure:  (typeof DOKU_COOKIE_PARAM.secure === "undefined"
                                          ? JSINFO.DOKU_COOKIE_PARAM.secure : DOKU_COOKIE_PARAM.secure)
                            });
                            jQuery(this).dialog("close");
                        },

                        // simple fermu la dialogon
                        "Rememoru min poste": function() {
                            jQuery(this).dialog("close");
                        }
                    },

                    // lasu "Rememoru min poste" elektita post apero
                    open: function() {
                        jQuery(this).parent().find('.ui-dialog-buttonpane button:eq(1)').focus(); 
                    }
                });
            }
        });

        // tajpado: ĉapeligu la kampon se la lasta signo estis ikso
        jQuery(this).keyup(function(event) {
            if (event.which == 88) { // x
                Cxapelado_Cxapeligi(event.target);
            } else if (event.which == 229) {
                // http://stackoverflow.com/questions/26123177/android-chrome-keypress-event-is-not-returning-any-key-data-jquery
                var currentCursorPos = jQuery(this)[0].selectionStart;
                var val = jQuery(this).val();
                var firstPrevious = val.charAt(currentCursorPos - 1);
                if (firstPrevious == 'x' || firstPrevious == 'X') {
                    Cxapelado_Cxapeligi(event.target);
                }
            }
        });
    });
});

// code below taken from WordPress plugin Cxapelado 0.3
// suba kodo ĉerpita el WordPress-a kromaĵo Cxapelado 0.3
// https://wordpress.org/plugins/cxapelado/

function Cxapelado_Cxapeligi(kampo) {
    if (kampo.selectionStart || kampo.selectionStart == "0") {
        var ekPoz = kampo.selectionStart;
        if (ekPoz > 1) {
            var literox = kampo.value.substr(ekPoz-2,2);
            var literou = Cxapelado_VereCxapeligi(literox);
            kampo.value = kampo.value.substr(0,ekPoz-2) + literou + kampo.value.substr(ekPoz);
            var celoPoz = ekPoz-(literox.length-literou.length);
            Cxapelado_kreiElektajxon(kampo,celoPoz,celoPoz);
        }
    } else if (document.selection) {
        var markilo = "\x7f"; // Retropaŝa signo - uzata nur ĉar apenaŭ estas risko, ke ĝi estas uzata intence de la uzanto
        var markiloREG = new RegExp(markilo);
        var rng = document.selection.createRange();
        rng.text = markilo;
        rng.select();
        var loko = kampo.value.indexOf(markilo);
        kampo.value = kampo.value.replace(markiloREG,'');
        if (loko > 1) {
            var komenco = kampo.value.substr(1,loko);
            var l = 0;
            var linioj;
            if (linioj = komenco.match(/\n/g)) {
                l = linioj.length;
            }
            var literox = kampo.value.substr(loko-2,2);
            var literou = Cxapelado_VereCxapeligi(literox);
            kampo.value = kampo.value.substr(0,loko-2) + literou + kampo.value.substr(loko);
            var celoPoz = loko-l-(literox.length-literou.length);
            Cxapelado_kreiElektajxon(kampo,celoPoz,celoPoz);
        } else {
            Cxapelado_kreiElektajxon(kampo,loko,loko);
        }
    }
}

var Cxapelado_literoj = new Object;
Cxapelado_literoj.cxRX = /c[Xx]/g;
Cxapelado_literoj.gxRX = /g[Xx]/g;
Cxapelado_literoj.hxRX = /h[Xx]/g;
Cxapelado_literoj.jxRX = /j[Xx]/g;
Cxapelado_literoj.sxRX = /s[Xx]/g;
Cxapelado_literoj.uxRX = /u[Xx]/g;
Cxapelado_literoj.CxRX = /C[Xx]/g;
Cxapelado_literoj.GxRX = /G[Xx]/g;
Cxapelado_literoj.HxRX = /H[Xx]/g;
Cxapelado_literoj.JxRX = /J[Xx]/g;
Cxapelado_literoj.SxRX = /S[Xx]/g;
Cxapelado_literoj.UxRX = /U[Xx]/g;
Cxapelado_literoj.cxxRX = /ĉ([Xx])/g;
Cxapelado_literoj.gxxRX = /ĝ([Xx])/g;
Cxapelado_literoj.hxxRX = /ĥ([Xx])/g;
Cxapelado_literoj.jxxRX = /ĵ([Xx])/g;
Cxapelado_literoj.sxxRX = /ŝ([Xx])/g;
Cxapelado_literoj.uxxRX = /ŭ([Xx])/g;
Cxapelado_literoj.CxxRX = /Ĉ([Xx])/g;
Cxapelado_literoj.GxxRX = /Ĝ([Xx])/g;
Cxapelado_literoj.HxxRX = /Ĥ([Xx])/g;
Cxapelado_literoj.JxxRX = /Ĵ([Xx])/g;
Cxapelado_literoj.SxxRX = /Ŝ([Xx])/g;
Cxapelado_literoj.UxxRX = /Ŭ([Xx])/g;
function Cxapelado_VereCxapeligi(t) {
    t = t.replace(Cxapelado_literoj.cxRX,"ĉ");
    t = t.replace(Cxapelado_literoj.gxRX,"ĝ");
    t = t.replace(Cxapelado_literoj.hxRX,"ĥ");
    t = t.replace(Cxapelado_literoj.jxRX,"ĵ");
    t = t.replace(Cxapelado_literoj.sxRX,"ŝ");
    t = t.replace(Cxapelado_literoj.uxRX,"ŭ");
    t = t.replace(Cxapelado_literoj.CxRX,"Ĉ");
    t = t.replace(Cxapelado_literoj.GxRX,"Ĝ");
    t = t.replace(Cxapelado_literoj.HxRX,"Ĥ");
    t = t.replace(Cxapelado_literoj.JxRX,"Ĵ");
    t = t.replace(Cxapelado_literoj.SxRX,"Ŝ");
    t = t.replace(Cxapelado_literoj.UxRX,"Ŭ");
    t = t.replace(Cxapelado_literoj.cxxRX,"c$1");
    t = t.replace(Cxapelado_literoj.gxxRX,"g$1");
    t = t.replace(Cxapelado_literoj.hxxRX,"h$1");
    t = t.replace(Cxapelado_literoj.jxxRX,"j$1");
    t = t.replace(Cxapelado_literoj.sxxRX,"s$1");
    t = t.replace(Cxapelado_literoj.uxxRX,"u$1");
    t = t.replace(Cxapelado_literoj.CxxRX,"C$1");
    t = t.replace(Cxapelado_literoj.GxxRX,"G$1");
    t = t.replace(Cxapelado_literoj.HxxRX,"H$1");
    t = t.replace(Cxapelado_literoj.JxxRX,"J$1");
    t = t.replace(Cxapelado_literoj.SxxRX,"S$1");
    t = t.replace(Cxapelado_literoj.UxxRX,"U$1");
    return t;
}

function Cxapelado_kreiElektajxon(input, selectionStart, selectionEnd) {
    if (input && input.setSelectionRange) {
        input.focus();
        input.setSelectionRange(selectionStart, selectionEnd);
    } else if (input && input.createTextRange) {
        var range = input.createTextRange();
        range.collapse(true);
        range.moveEnd("character", selectionEnd);
        range.moveStart("character", selectionStart);
        range.select();
    }
}
