//Simple animated example of d3-cloud - https://github.com/jasondavies/d3-cloud
//Based on https://github.com/jasondavies/d3-cloud/blob/master/examples/simple.html

// Encapsulate the word cloud functionality
function wordCloud(selector) {

    var color = d3.scale.linear()
        .domain([0,1,2,3,4,5,6,10,15,20,100])
        .range(["#ddd", "#ccc", "#bbb", "#aaa", "#999", "#888", "#777", "#666", "#555", "#444", "#333", "#222"]);

    var fill = d3.scale.category20();

    //Construct the word cloud's SVG element
    var svg = d3.select(selector).append("svg")
        .attr("width", 960)
        .attr("height", 230)
        .append("g")
        .attr("transform", "translate(455,100)");


    //Draw the word cloud
    function draw(words) {
        var cloud = svg.selectAll("g text")
            .data(words, function(d) { return d.text; })

        //Entering words
        cloud.enter()
            .append("text")
            .style("font-family", "Helvetica Neue")
            .style("fill", function(d, i) { return color(i); })
            .attr("text-anchor", "middle")
            .attr('font-size', 1)
            .text(function(d) { return d.text; });

        //Entering and existing words
        cloud
            .transition()
            .duration(1200)
            .style("font-size", function(d) { return d.size + "px"; })
            .attr("transform", function(d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .style("fill-opacity", 1);

        //Exiting words
        cloud.exit()
            .transition()
            .duration(1200)
            .style('fill-opacity', 1e-6)
            .attr('font-size', 1)
            .remove();
    }


    //Use the module pattern to encapsulate the visualisation code. We'll
    // expose only the parts that need to be public.
    return {

        //Recompute the word cloud for a new set of words. This method will
        // asycnhronously call draw when the layout has been computed.
        //The outside world will need to call this function, so make it part
        // of the wordCloud return value.
        update: function(words) {
            d3.layout.cloud().size([950, 210])
                .words(words)
                .padding(2)
                .rotate(function() { return ~~(Math.random() * 2) * 90; })
                .font("Impact")
                .fontSize(function(d) { return d.size; })
                .on("end", draw)
                .start();
        }
    }

}

function init(myWords) {
//Some sample data - http://en.wikiquote.org/wiki/Opening_lines
    var _words = myWords;

//Prepare one of the sample sentences by removing punctuation,
// creating an array of words and computing a random size attribute.
    function getWords(i) {
        return _words.map(function (d) {
            //console.log(d.size);

            var wordSize = 0;

            if((d.size / 100) < 20) {
                wordSize = d.size * 0.2;
            }
            else
                wordSize = d.size * 0.01;

            return {text: d.text, size: wordSize};
        })
    }

//This method tells the word cloud to redraw with a new set of words.
//In reality the new words would probably come from a server request,
// user input or some other source.
    function showNewWords(vis, i) {
        i = i || 0;

        vis.update(getWords(i++ % _words.length))
        setTimeout(function () {
            showNewWords(vis, i + 1)
        }, 2000)
    }

//Create a new instance of the word cloud visualisation.
    var myWordCloud = wordCloud('body');

//Start cycling through the demo data
    showNewWords(myWordCloud);
}
