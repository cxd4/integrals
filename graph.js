var X = 0, Y = 1, Z = 2, W = 3;
var raster_pitch = 512; /* attributes 'width' and 'height' of CANVAS element */
var inverse_zoom = 1.0; /* graph magnification = 1 / inverse_zoom */

function clear_graph() {
    "use strict"
    var grid = [
        -1, 0, 0, 1,
        +1, 0, 0, 1,
        0, -1, 0, 1,
        0, +1, 0, 1
    ];

    glEnable(GL_BLEND);
    glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);

    glColorMask(GL_TRUE, GL_TRUE, GL_TRUE, GL_TRUE);
    glColor4f(1, 1, 1, 1.000);

    glClearColor(0, 0, 0, 0.000);
    glClear(GL_COLOR_BUFFER_BIT);

    glVertexPointer(2, GL_FLOAT, 4 * 4, grid);
    glEnableClientState(GL_VERTEX_ARRAY);

    glLineWidth(1.0);
    glDisableClientState(GL_COLOR_ARRAY);

    glDrawArrays(GL_LINES, 0, 2); /* x-axis */
    glDrawArrays(GL_LINES, 2, 2); /* y-axis */
    return;
}

function main_GL() {
    "use strict";
    var error_code;

    if (GL_get_context(document, "GL_canvas") === null) {
        alert("Failed to initialize WebGL.");
        return;
    }

    clear_graph();
    do {
        error_code = glGetError();
        console.log("OpenGL error status:  " + error_code);
    } while (error_code !== GL_NO_ERROR);
    return;
}

/**
 * End of graph definition and initialization procedures.
 * Begin definitions for graph construction functions.
 */

function graph_power() {
    "use strict";
    var x = -1.0 / inverse_zoom;
    var i = 0;
    var coords = 2;
    var stride = 4 * 4; /* coords_per_vertex * sizeof(GLfloat) */
    var vertex_buffer = [];

    var c;
    var n;

    while (i < raster_pitch) {
        vertex_buffer[4*i + X] = x;
        x += 2.0 / raster_pitch;
        vertex_buffer[4*i + Z] = 0.0;
        vertex_buffer[4*i + W] = inverse_zoom;
        i += 1;
    }

    clear_graph();
    glEnableClientState(GL_VERTEX_ARRAY);
    glDisableClientState(GL_COLOR_ARRAY);
    glLineWidth(1.0);

    c = document.getElementById("c").value;
    if (!c) {
        c = 1;
    }
    n = document.getElementById("n").value;
    if (!n) {
        n = 0;
    }

    i = 0;
    x = -1.0 / inverse_zoom;
    while (i < raster_pitch) {
        vertex_buffer[4*i + Y] = c * Math.pow(x, n);
        x += 2.0 / raster_pitch;
        i += 1;
    }
    glColor4f(0, 1, 0, 1); /* green (original function) */
    glVertexPointer(coords, GL_FLOAT, stride, vertex_buffer);
    glDrawArrays(GL_LINE_STRIP, 0, i);
    return;
}
