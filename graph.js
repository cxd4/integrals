var X = 0, Y = 1, Z = 2, W = 3;
var raster_pitch = 512; /* attributes 'width' and 'height' of CANVAS element */
var inverse_zoom = 1.0; /* graph magnification = 1 / inverse_zoom */

function clear_graph() {
    "use strict"
    var grid = [
        -inverse_zoom, 0, 0.0, inverse_zoom,
        +inverse_zoom, 0, 0.0, inverse_zoom,
        0, -inverse_zoom, 0.0, inverse_zoom,
        0, +inverse_zoom, 0.0, inverse_zoom
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

function var_from_URI(name)
{
    "use strict";
    var offset, offset1, offset2;
    var href = document.location.href;

    offset1 = href.indexOf("?" + name + "=");
    offset2 = href.lastIndexOf("&" + name + "=");
    offset = (offset1 < offset2) ? offset2 : offset1;

    if (offset < 0) {
        return;
    }
    offset += 1; /* Jump past the '?' or '&' character. */
    offset += name.length; /* Jump past the variable name itself. */
    offset += 1; /* Jump past the '=' sign character. */
    offset2 = href.indexOf("&", offset);
    if (offset2 < 0) {
        offset2 = href.length;
    }
    return href.substring(offset, offset2);
}

function main_GL() {
    "use strict";
    var error_code;
    var line_width = var_from_URI("l");

    if (GL_get_context(document, "GL_canvas") === null) {
        alert("Failed to initialize WebGL.");
        return;
    }

    glEnable(GL_BLEND);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
    clear_graph();
    do {
        error_code = glGetError();
        console.log("OpenGL error status:  " + error_code);
    } while (error_code !== GL_NO_ERROR);

    inverse_zoom = var_from_URI("w");
    if (!(inverse_zoom > 0)) {
        inverse_zoom = 1;
    }
    document.getElementById("wu").innerHTML = inverse_zoom;
    document.getElementById("wd").innerHTML = inverse_zoom;
    document.getElementById("wr").innerHTML = inverse_zoom;

    if (!(line_width > 0)) {
        line_width = 1;
    }
    glLineWidth(line_width);

    raster_pitch = var_from_URI("r");
    if (!(raster_pitch > 0)) {
        raster_pitch = 512;
    }
    document.getElementById("GL_canvas").width = raster_pitch;
    document.getElementById("GL_canvas").height = raster_pitch;
    glViewport(0, 0, raster_pitch, raster_pitch);
    return;
}

/**
 * End of graph definition and initialization procedures.
 * Begin definitions for graph construction functions.
 */

function graph_power() {
    "use strict";
    var x = -1.0 * inverse_zoom;
    var i = 0;
    var coords = 4;
    var stride = 4 * 4; /* coords_per_vertex * sizeof(GLfloat) */
    var vertex_buffer = [];

    var c = document.getElementById("c").value;
    var n = document.getElementById("n").value;
    if (!c) {
        c = 1;
    }
    if (!n) {
        n = 0;
    }

    while (i < raster_pitch) {
        vertex_buffer[4*i + X] = x;
        vertex_buffer[4*i + Y] = c * Math.pow(x, n);
        x += (1.0 * 2) / (raster_pitch / inverse_zoom);
        vertex_buffer[4*i + Z] = 0.0;
        vertex_buffer[4*i + W] = inverse_zoom;
        i += 1;
    }

    clear_graph();
    glEnableClientState(GL_VERTEX_ARRAY);
    glDisableClientState(GL_COLOR_ARRAY);

    glColor4f(0, 1, 0, 1); /* green (original function) */
    glVertexPointer(coords, GL_FLOAT, stride, vertex_buffer);
    glDrawArrays(GL_LINE_STRIP, 0, i);
    return;
}
