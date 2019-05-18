var line_cache = [
    -Infinity, null, 0.0, inverse_zoom,
    +Infinity, null, 0.0, inverse_zoom
];

function tan_power(x_raster) {
    "use strict";
    var coords = 4;
    var stride = coords * 4; /* coords * sizeof(GLfloat) */

    var y1, m, b;
    var x1 = 2*(x_raster/raster_pitch - 0.5) * inverse_zoom;

    var c = document.getElementById("c").value;
    var n = document.getElementById("n").value;
    if (!c || !n) {
        return;
    }

    y1 = c * Math.pow(x1, n);
    m = c * n * Math.pow(x1, n - 1); /* f'(x) */
    b = m * (0 - x1) + y1;
    line_cache[4*0 + X] = -1.0 * inverse_zoom;
    line_cache[4*1 + X] = +1.0 * inverse_zoom;
    line_cache[4*0 + Y] = m * (line_cache[4 * 0 + X] - x1) + y1;
    line_cache[4*1 + Y] = m * (line_cache[4 * 1 + X] - x1) + y1;

    clear_graph();
    document.getElementById("x").innerHTML = x1 * raster_pitch/2 + "/" + raster_pitch/2;
    document.getElementById("y").innerHTML = y1;
    document.getElementById("m").innerHTML = m;
    document.getElementById("b").innerHTML = b;

    graph_power();
    glEnableClientState(GL_VERTEX_ARRAY);
    glDisableClientState(GL_COLOR_ARRAY);

    glColor4f(1, 0, 0, 1); /* red (tangent line function of derivative) */
    glVertexPointer(coords, GL_FLOAT, stride, line_cache);
    glDrawArrays(GL_LINES, 0, 2);
    return;
}
function tan_exp(x_raster) {
    "use strict";
    var coords = 4;
    var stride = coords * 4; /* coords * sizeof(GLfloat) */

    var y1, m, b;
    var x1 = 2*(x_raster/raster_pitch - 0.5) * inverse_zoom;

    var c = document.getElementById("c").value;
    var b = document.getElementById("b").value;
    if (!c || !b) {
        return;
    }

    y1 = c * Math.pow(b, x1);
    m = c * Math.log(b) * Math.pow(b, x1); /* f'(x) */
    b = m * (0 - x1) + y1;
    line_cache[4*0 + X] = -1.0 * inverse_zoom;
    line_cache[4*1 + X] = +1.0 * inverse_zoom;
    line_cache[4*0 + Y] = m * (line_cache[4*0 + X] - x1) + y1;
    line_cache[4*1 + Y] = m * (line_cache[4*1 + X] - x1) + y1;

    clear_graph();
    document.getElementById("x").innerHTML = x1 * raster_pitch/2 + "/" + raster_pitch/2;
    document.getElementById("y").innerHTML = y1;
    document.getElementById("m").innerHTML = m;
    document.getElementById("b").innerHTML = b;

    graph_exp();
    glEnableClientState(GL_VERTEX_ARRAY);
    glDisableClientState(GL_COLOR_ARRAY);

    glColor4f(1, 0, 0, 1); /* red (tangent line function of derivative) */
    glVertexPointer(coords, GL_FLOAT, stride, line_cache);
    glDrawArrays(GL_LINES, 0, 2);
    return;
}
