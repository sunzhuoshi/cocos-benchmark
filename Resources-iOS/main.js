require("jsb_cocos2d_constants.js");
require("jsb_cocos2d.js");
require("jsb_cocosbuilder.js");
require("jsb_opengl_constants.js");
require("jsb_opengl.js");
require("jsb_sys.js");

var appFiles = [
    'src/resources.js',
    'src/cocos-benchmark.js',
    'src/cocos-benchmark-native.js',
    //"src/BenchmarkDevController.js", // use it to test error and get reference values
    'src/tests/DrawPrimitives/BenchmarkDrawPrimitivesTest.js',
    'src/tests/Particle/BenchmarkParticleTest.js',
    'src/tests/Sprite/BenchmarkSpriteTest.js',
    'src/tests/TileMap/BenchmarkTileMapTest.js'
];

function main()
{
    var i;
    for (i=0; i<appFiles.length; ++i) {
        require(appFiles[i]);
    }
	//cc.FileUtils.getInstance().loadFilenameLookup("fileLookup.plist");
    //cc.Texture2D.setDefaultAlphaPixelFormat(6);
	var director = cc.Director.getInstance();    
    var scene = new BenchmarkEntryScene();
    var runningScene = director.getRunningScene();
    if (runningScene === null) director.runWithScene(scene);
    else director.replaceScene(scene);
}

main();