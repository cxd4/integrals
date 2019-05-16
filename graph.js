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
