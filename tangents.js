var line_cache = [
    -Infinity, null, 0.0, inverse_zoom,
    +Infinity, null, 0.0, inverse_zoom
];
function tan_f() {
    "use strict";
    glEnableClientState(GL_VERTEX_ARRAY);
    glDisableClientState(GL_COLOR_ARRAY);

    glColor4f(1, 0, 0, 1); /* red (tangent line function of derivative) */
    glVertexPointer(4, GL_FLOAT, 4 * 4, line_cache);
    glDrawArrays(GL_LINES, 0, 2);
    return;
}

function tan_power(x_raster) {
    "use strict";
    var y1, m, b;
    var x1 = 2*(x_raster/raster_pitch - 0.5) * inverse_zoom;

    var c = var_from_form("c");
    var n = var_from_form("n");
    if (!c || !n) {
        return;
    }

    y1 = c * Math.pow(x1, n);
    m = c * n * Math.pow(x1, n - 1); /* f'(x1) */
    b = m * (0 - x1) + y1;
    line_cache[4*0 + Y] = m * (line_cache[4*0 + X] - x1) + y1;
    line_cache[4*1 + Y] = m * (line_cache[4*1 + X] - x1) + y1;

    document.getElementById("x").innerHTML = x1 * raster_pitch/2 + "/" + raster_pitch/2;
    document.getElementById("y").innerHTML = y1;
    document.getElementById("m").innerHTML = m;
    document.getElementById("yint").innerHTML = b;

    graph_power();
    tan_f();
    return;
}
function tan_exp(x_raster) {
    "use strict";
    var y1, m, b;
    var x1 = 2*(x_raster/raster_pitch - 0.5) * inverse_zoom;

    var c = var_from_form("c");
    var b = var_from_form("b");
    if (!c || !b) {
        return;
    }

    y1 = c * Math.pow(b, x1);
    m = c * Math.log(b) * Math.pow(b, x1); /* f'(x1) */
    b = m * (0 - x1) + y1;
    line_cache[4*0 + Y] = m * (line_cache[4*0 + X] - x1) + y1;
    line_cache[4*1 + Y] = m * (line_cache[4*1 + X] - x1) + y1;

    document.getElementById("x").innerHTML = x1 * raster_pitch/2 + "/" + raster_pitch/2;
    document.getElementById("y").innerHTML = y1;
    document.getElementById("m").innerHTML = m;
    document.getElementById("yint").innerHTML = b;

    graph_exp();
    tan_f();
    return;
}
