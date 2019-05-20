var X = 0, Y = 1, Z = 2, W = 3;
var raster_pitch = 513; /* attributes 'width' and 'height' of CANVAS element */
var inverse_zoom = 1.0; /* graph magnification = 1 / inverse_zoom */

var vertex_buffer = [];

function clear_graph() {
    "use strict"
    var grid = [
        -inverse_zoom - 1, 0, 0.0, inverse_zoom,
        +inverse_zoom + 1, 0, 0.0, inverse_zoom,
        0, -inverse_zoom - 1, 0.0, inverse_zoom,
        0, +inverse_zoom + 1, 0.0, inverse_zoom
    ];

    glColorMask(GL_TRUE, GL_TRUE, GL_TRUE, GL_TRUE);
    glColor4f(1, 1, 1, 1.000);

    glClearColor(0, 0, 0, 0.000);
    glClear(GL_COLOR_BUFFER_BIT);

    glVertexPointer(4, GL_FLOAT, 4 * 4, grid);
    glEnableClientState(GL_VERTEX_ARRAY);
    glDisableClientState(GL_COLOR_ARRAY);

    glDrawArrays(GL_LINES, 0, 2); /* x-axis */
    glDrawArrays(GL_LINES, 2, 2); /* y-axis */
    return;
}

function var_from_URI(name, default_value) {
    "use strict";
    var offset, offset1, offset2;
    var tentative_value;
    var href = document.location.href;

    offset1 = href.indexOf("?" + name + "=");
    offset2 = href.lastIndexOf("&" + name + "=");
    offset = (offset1 < offset2) ? offset2 : offset1;

    if (offset < 0) {
        return (default_value);
    }
    offset += 1 + name.length + 1; /* Jump past ?/&, (name), and '='. */
    offset2 = href.indexOf("&", offset);
    if (offset2 < 0) {
        offset2 = href.length;
    }
    tentative_value = href.substring(offset, offset2);

    if (isNaN(tentative_value) || isNaN(Number(tentative_value))) {
        return (default_value);
    }
    return (tentative_value);
}
function var_from_form(name, default_value) {
    "use strict";
    var found_value = document.getElementById(name).value;

    if (isNaN(found_value) || isNaN(Number(found_value))) {
        return (default_value);
    }
    return Number(found_value);
}

function main_GL() {
    "use strict";
    var error_code;
    var i = 0;
    var user_vars = "bcn";

    if (GL_get_context(document, "GL_canvas") === null) {
        alert("Failed to initialize WebGL.");
        return;
    }
    glLineWidth(var_from_URI("l", 1));

    while (i < user_vars.length) {
        var user_def = var_from_URI(user_vars[i]);
        if (parseFloat(user_def)) {
            document.getElementById(user_vars[i]).value = user_def;
        }
        i += 1;
    }
    i = 0;
    document.body.style.marginLeft = "8px"; /* needed for tangent.js to read */

    glEnable(GL_BLEND);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
    clear_graph();
    do {
        error_code = glGetError();
        console.log("OpenGL error status:  " + error_code);
    } while (error_code !== GL_NO_ERROR);

    inverse_zoom = var_from_URI("w", 1);
    document.getElementById("wu").innerHTML = inverse_zoom;
    document.getElementById("wd").innerHTML = inverse_zoom;
    document.getElementById("wr").innerHTML = inverse_zoom;
    line_cache[4*0 + X] = -inverse_zoom;
    line_cache[4*1 + X] = +inverse_zoom;
    line_cache[4*1 + W] = line_cache[4*0 + W] = inverse_zoom;

    raster_pitch = var_from_URI("r", 512 + 1);
    document.getElementById("GL_canvas").width = raster_pitch;
    document.getElementById("GL_canvas").height = raster_pitch;
    glViewport(0, 0, raster_pitch, raster_pitch);

    var x = -1.0 * inverse_zoom;
    while (i < raster_pitch) {
        vertex_buffer[4*i + X] = x;
        vertex_buffer[4*i + Z] = 0.0;
        vertex_buffer[4*i + W] = inverse_zoom;
        x += (1.0 * 2) / (raster_pitch / inverse_zoom);
	i += 1;
    }
    return;
}

var first_time_graphing = true;
function graph_f(callback) {
    "use strict";
    var x = var_from_URI("x");

    clear_graph();
    glEnableClientState(GL_VERTEX_ARRAY);
    glDisableClientState(GL_COLOR_ARRAY);

    glColor4f(0, 1, 0, 1); /* green (original function) */
    glVertexPointer(4, GL_FLOAT, 4 * 4, vertex_buffer);
    glDrawArrays(GL_LINE_STRIP, 0, raster_pitch);

    if (first_time_graphing && x) {
        first_time_graphing = false;
        callback(x);
    }
    return;
}

function root(x, index) {
    "use strict";
    var a = index;
    var b = 1;
    var evaluation = Math.pow(x, b / a);

    if (index === 0) {
        return (undefined); /* 0th root of x = x^(C/0), which is asymptotal. */
    }
    if (!isNaN(evaluation)) { /* Math.pow(-2, 1 / 0.5) doesn't need our help. */
        return (evaluation);
    }

/*
 * If we are taking nth roots of negative numbers, then we must be careful to
 * account not only for whether n is an even or odd integer but also for the
 * liklihood that the user will set n to non-integer, floating-point values.
 *
 * While C is implemented on most computers with FLT_RADIX defined to 2, it
 * makes sense to take a non-integer ratio of (a/b = n/1) and keep
 * multiplying both a and b by 10 until we have a ratio of integers, since
 * 10 (and not 2) is the arithmetic base the user perceives input to be in.
 */
    while (a % 1 !== 0) {
        a *= 10;
        b *= 10;
    }

/*
 * Account for cases such as the (6/4)-root of x = x^(4/6).
 * x^(4/6) is an odd-index root due to the fact that 4/6 is 2/3.
 */
    while (a % 2 === 0 && b % 2 === 0) {
        a /= 2;
        b /= 2;
    }
// alert("a / b = " + a + " / " + b + " ~= " + a / b);

/* As the (a/b)-th root of x is equal to x^(b/a), we then care if (a) is odd. */
    if (a % 2 === 0) {
        return (NaN); /* Even-roots of x when (x < 0) are never real numbers. */
    }
    return -Math.pow(-x, 1 / index); /* e.g., (-8)^(3333/10000) hacked to -2 */
}
function power(x, n) {
    "use strict";
    var a = n;
    var b = 1;
    var evaluation = Math.pow(x, a / b);

    if (!isNaN(evaluation)) { /* Math.pow(-1, 0) doesn't need our help. */
        return (evaluation);
    }

    while (a % 1 !== 0) {
        a *= 10;
        b *= 10;
    }
    while (a % 2 === 0 && b % 2 === 0) {
        a /= 2;
        b /= 2;
    }
// alert("a / b = " + a + " / " + b + " ~= " + a / b);

    if (b % 2 === 0) {
        return (NaN); /* Even-roots of x when (x < 0) are never real numbers. */
    }
    return -Math.pow(-x, n); /* fails when (n === 0), which was accounted for */
}

/**
 * End of graph definition and initialization procedures.
 * Begin definitions for graph construction functions.
 */

function graph_linear() {
    "use strict";
    var i = 0;
    var x = -inverse_zoom;
    var a = var_from_form("a", 1);
    var b = var_from_form("b", 0);

    while (i < raster_pitch) {
        vertex_buffer[4*i + Y] = (a * x) + b;
        x += (2 * inverse_zoom) / raster_pitch;
        i += 1;
    }
    graph_f(tan_linear);
    return;
}
function graph_power() {
    "use strict";
    var i = 0;
    var x = -inverse_zoom;
    var c = var_from_form("c", 1);
    var n = var_from_form("n", 2);

    while (i < raster_pitch) {
        vertex_buffer[4*i + Y] = c * power(x, n);
        x += (2 * inverse_zoom) / raster_pitch;
        i += 1;
    }
    graph_f(tan_power);
    return;
}
function graph_root() {
    "use strict";
    var i = 0;
    var x = -inverse_zoom;
    var c = var_from_form("c", 1);
    var n = var_from_form("n", 2);

    while (i < raster_pitch) {
        vertex_buffer[4*i + Y] = c * root(x, n);
        x += (2 * inverse_zoom) / raster_pitch;
        i += 1;
    }
    graph_f(tan_root);
    return;
}
function graph_exp() {
    "use strict";
    var i = 0;
    var x = -inverse_zoom;
    var c = var_from_form("c", 1);
    var b = var_from_form("b", Math.E);

    while (i < raster_pitch) {
        vertex_buffer[4*i + Y] = c * power(b, x);
        x += (2 * inverse_zoom) / raster_pitch;
        i += 1;
    }
    graph_f(tan_exp);
    return;
}
