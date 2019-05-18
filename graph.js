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

    if (tentative_value) {
        return (tentative_value);
    }
    return (default_value);
}
function var_from_form(name, default_value) {
    "use strict";
    var found_value = document.getElementById(name).value;

    if (!found_value) {
        return (default_value);
    }
    return (found_value);
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

/**
 * End of graph definition and initialization procedures.
 * Begin definitions for graph construction functions.
 */

function graph_power() {
    "use strict";
    var i = 0;
    var x = -inverse_zoom;
    var c = var_from_form("c", 1);
    var n = var_from_form("n", 0);

    while (i < raster_pitch) {
        vertex_buffer[4*i + Y] = c * Math.pow(x, n);
        x += (2 * inverse_zoom) / raster_pitch;
        i += 1;
    }
    graph_f(tan_power);
    return;
}
function graph_exp() {
    "use strict";
    var i = 0;
    var x = -inverse_zoom;
    var c = var_from_form("c", 1);
    var b = var_from_form("b", 0);

    while (i < raster_pitch) {
        vertex_buffer[4*i + Y] = c * Math.pow(b, x);
        x += (2 * inverse_zoom) / raster_pitch;
        i += 1;
    }
    graph_f(tan_exp);
    return;
}
