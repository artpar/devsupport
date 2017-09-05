import FileProcessorFactor from '@/plugins/changehandler';
import JavaParser from 'java-parser';

describe('changeHandler.js',function () {
  it('should inject file correctly',function () {

    try {
      var change = {};
      let changeHandler = new FileProcessorFactor.ChangeHandler(change);
      changeHandler.addFile("test/unit/Files/Default/notSoMainJava.java")
      changeHandler.doChange({
        var1: "value1"
      });
      console.log("this is what factory returns", changeHandler);
      console.log("did it force to rerun tests");
    } catch (e) {
      console.log("phat", e)
    }
  });
  
});
