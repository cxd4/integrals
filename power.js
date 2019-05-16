function tangent_line(x_raster) {
    "use strict";
    var coords = 4;
    var stride = coords * 4; /* coords * sizeof(GLfloat) */

    var y1, m, b;
    var x1 = (2 * x_raster / raster_pitch) - 1.0;
    var vertex_buffer = [
        -1, null, 0.0, inverse_zoom,
	+1, null, 0.0, inverse_zoom
    ];

    var c = document.getElementById("c").value;
    var n = document.getElementById("n").value;
    if (!c || !n) {
        return;
    }

    y1 = c * Math.pow(x1, n);
    m = c * n * Math.pow(x1, n - 1); /* f'(x) */
    b = m * (0 - x1) + y1;
    vertex_buffer[4 * 0 + Y] = m * (vertex_buffer[4 * 0 + X] - x1) + y1;
    vertex_buffer[4 * 1 + Y] = m * (vertex_buffer[4 * 1 + X] - x1) + y1;

    clear_graph();
    document.getElementById("x").innerHTML = x1;
    document.getElementById("y").innerHTML = y1;
    document.getElementById("m").innerHTML = m;
    document.getElementById("b").innerHTML = b;

    graph_power();
    glEnableClientState(GL_VERTEX_ARRAY);
    glDisableClientState(GL_COLOR_ARRAY);
    glLineWidth(1.0);

    glColor4f(1, 0, 0, 1); /* red (tangent line function of derivative) */
    glVertexPointer(coords, GL_FLOAT, stride, vertex_buffer);
    glDrawArrays(GL_LINES, 0, 2);
    return;
}
