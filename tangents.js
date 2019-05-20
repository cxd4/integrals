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

function align_pitch(pitch) {
    "use strict";
    var precision_error = pitch % 2;
    return (pitch - precision_error);
}
function raster_to_vector(x_raster) {
    "use strict";
    var left_margin = parseInt(document.body.style.marginLeft);
    var x_minus_left_margin = x_raster - left_margin - (raster_pitch % 2);

    var scalar_divisor = align_pitch(raster_pitch);
    var zero_indexed_coord = x_minus_left_margin / scalar_divisor;
    var neg_one_indexed = 2 * (zero_indexed_coord - 0.5);
    var scaled_x = neg_one_indexed * inverse_zoom;

    return (scaled_x);
}

function tan_linear(x1) {
    "use strict";
    var y1, m, b;

    var a = var_from_form("a", NaN);
    var b = var_from_form("b", NaN);
    if (a === NaN || b === NaN) {
        return;
    }

    y1 = (a * x1) + b;
    m = a; /* f'(x1) */
    b = m * (0 - x1) + y1;
    line_cache[4*0 + Y] = m * (line_cache[4*0 + X] - x1) + y1;
    line_cache[4*1 + Y] = m * (line_cache[4*1 + X] - x1) + y1;

    document.getElementById("x").innerHTML =
        x1 * align_pitch(raster_pitch)/2 + "/" + align_pitch(raster_pitch)/2;
    document.getElementById("y").innerHTML = y1;
    document.getElementById("m").innerHTML = m;
    document.getElementById("yint").innerHTML = b;

    graph_linear();
    tan_f();
    return;
}
function tan_power(x1) {
    "use strict";
    var y1, m, b;

    var c = var_from_form("c", NaN);
    var n = var_from_form("n", NaN);
    if (c === NaN || n === NaN) {
        return;
    }

    y1 = c * power(x1, n);
    m = c * n * power(x1, n - 1); /* f'(x1) */
    b = m * (0 - x1) + y1;
    line_cache[4*0 + Y] = m * (line_cache[4*0 + X] - x1) + y1;
    line_cache[4*1 + Y] = m * (line_cache[4*1 + X] - x1) + y1;

    document.getElementById("x").innerHTML =
        x1 * align_pitch(raster_pitch)/2 + "/" + align_pitch(raster_pitch)/2;
    document.getElementById("y").innerHTML = y1;
    document.getElementById("m").innerHTML = m;
    document.getElementById("yint").innerHTML = b;

    graph_power();
    tan_f();
    return;
}
function tan_root(x1) {
    "use strict";
    var y1, m, b;

    var c = var_from_form("c", NaN);
    var n = var_from_form("n", NaN);
    if (c === NaN || n === NaN) {
        return;
    }

    y1 = c * root(x1, n);
    m = (c / n) * root(x1, n) / x1; /* f'(x) */

    b = m * (0 - x1) + y1;
    line_cache[4*0 + Y] = m * (line_cache[4*0 + X] - x1) + y1;
    line_cache[4*1 + Y] = m * (line_cache[4*1 + X] - x1) + y1;

    document.getElementById("x").innerHTML =
        x1 * align_pitch(raster_pitch)/2 + "/" + align_pitch(raster_pitch)/2;
    document.getElementById("y").innerHTML = y1;
    document.getElementById("m").innerHTML = m;
    document.getElementById("yint").innerHTML = b;

    graph_root();
    tan_f();
    return;
}
function tan_exp(x1) {
    "use strict";
    var y1, m, b;

    var c = var_from_form("c", NaN);
    var b = var_from_form("b", NaN);
    if (c === NaN || b === NaN) {
        return;
    }

    y1 = c * power(b, x1);
    m = c * Math.log(b) * power(b, x1); /* f'(x1) */
    b = m * (0 - x1) + y1;
    line_cache[4*0 + Y] = m * (line_cache[4*0 + X] - x1) + y1;
    line_cache[4*1 + Y] = m * (line_cache[4*1 + X] - x1) + y1;

    document.getElementById("x").innerHTML =
        x1 * align_pitch(raster_pitch)/2 + "/" + align_pitch(raster_pitch)/2;
    document.getElementById("y").innerHTML = y1;
    document.getElementById("m").innerHTML = m;
    document.getElementById("yint").innerHTML = b;

    graph_exp();
    tan_f();
    return;
}
