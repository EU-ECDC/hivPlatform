const DefineReactFileInputBinding = (appManager) => {
  console.log('DefineReactFileInputBinding called');

  var FileProcessor = function FileProcessor(files) {
    this.files = files;
    this.fileIndex = -1; // Currently need to use small chunk size because R-Websockets can't
    // handle continuation frames

    this.aborted = false;
    this.completed = false; // TODO: Register error/abort callbacks

    this.$run();
  };

  (function () {
      // Begin callbacks. Subclassers/cloners may override any or all of these.
      this.onBegin = function (files, cont) {
        setTimeout(cont, 0);
      };

      this.onFile = function (file, cont) {
        setTimeout(cont, 0);
      };

      this.onComplete = function () { };

      this.onAbort = function () { }; // End callbacks
      // Aborts processing, unless it's already completed


      this.abort = function () {
        if (this.completed || this.aborted) return;
        this.aborted = true;
        this.onAbort();
      }; // Returns a bound function that will call this.$run one time.


      this.$getRun = function () {
        var self = this;
        var called = false;
        return function () {
          if (called) return;
          called = true;
          self.$run();
        };
      }; // This function will be called multiple times to advance the process.
      // It relies on the state of the object's fields to know what to do next.


      this.$run = function () {
        if (this.aborted || this.completed) return;

        if (this.fileIndex < 0) {
          // Haven't started yet--begin
          this.fileIndex = 0;
          this.onBegin(this.files, this.$getRun());
          return;
        }

        if (this.fileIndex === this.files.length) {
          // Just ended
          this.completed = true;
          this.onComplete();
          return;
        } // If we got here, then we have a file to process, or we are
        // in the middle of processing a file, or have just finished
        // processing a file.


        var file = this.files[this.fileIndex++];
        this.onFile(file, this.$getRun());
      };
    }).call(FileProcessor.prototype);

  var ReactFileUploader = function (shinyapp, id, files, el, progressCallback, binding) {
    this.shinyapp = shinyapp;
    this.id = id;
    this.el = el;
    this.progressCallback = progressCallback;
    this.binding = binding;
    FileProcessor.call(this, files);
  };

  $.extend(ReactFileUploader.prototype, FileProcessor.prototype);

  (function () {
    this.makeRequest = function (method, args, onSuccess, onFailure, blobs) {
      this.shinyapp.makeRequest(method, args, onSuccess, onFailure, blobs);
    };
    this.onBegin = function (files, cont) {
      var self = this;

      this.onProgress(0);

      this.totalBytes = 0;
      this.progressBytes = 0;
      $.each(files, function (i, file) {
        self.totalBytes += file.size;
      });

      var fileInfo = $.map(files, function (file) {
        return {
          name: file.name,
          size: file.size,
          type: file.type
        };
      });

      this.makeRequest(
        'uploadInit', [fileInfo],
        function (response) {
          self.jobId = response.jobId;
          self.uploadUrl = response.uploadUrl;
          cont();
        },
        function (error) {
          self.onError(error);
        });
    };
    this.onFile = function (file, cont) {
      var self = this;
      this.onProgress(0);

      $.ajax(this.uploadUrl, {
        type: 'POST',
        cache: false,
        xhr: function () {
          var xhrVal = $.ajaxSettings.xhr();
          if (xhrVal.upload) {
            xhrVal.upload.onprogress = function (e) {
              if (e.lengthComputable) {
                self.onProgress((self.progressBytes + e.loaded) / self.totalBytes);
              }
            };
          }
          return xhrVal;
        },
        data: file,
        contentType: 'application/octet-stream',
        processData: false,
        success: function () {
          self.progressBytes += file.size;
          cont();
        },
        error: function (jqXHR, textStatus) {
          self.onError(jqXHR.responseText || textStatus);
        }
      });
    };
    this.onComplete = function () {
      var self = this;

      var fileInfo = $.map(this.files, function (file) {
        return {
          name: file.name,
          size: file.size,
          type: file.type
        };
      });

      // Trigger shiny:inputchanged. Unlike a normal shiny:inputchanged event,
      // it's not possible to modify the information before the values get
      // sent to the server.
      var evt = jQuery.Event('shiny:inputchanged');
      evt.name = this.id;
      evt.value = fileInfo;
      evt.binding = this.binding;
      evt.el = this.el;
      evt.inputType = 'shiny.fileupload';
      $(document).trigger(evt);

      this.makeRequest(
        'uploadEnd', [this.jobId, this.id],
        function () {
          self.onProgress(null);
        },
        function (error) {
          self.onError(error);
        });
    };
    this.onError = function (message) {
      console.log('onError: ', message);
      this.progressCallback(null);
    };
    this.onAbort = function () {
      console.log('onAbort');
      this.progressCallback(null);
    };
    this.onProgress = function (percentage) {
      this.progressCallback(percentage);
    };
  }).call(ReactFileUploader.prototype);

  // If previously selected files are uploading, abort that.
  function abortCurrentUpload($el) {
    var uploader = $el.data('currentUploader');
    if (uploader) uploader.abort();
    // Clear data-restore attribute if present.
    $el.removeAttr('data-restore');
  };

  function uploadCaseBasedFiles(evt) {
    var $el = $(evt.target);
    abortCurrentUpload($el);

    var files = evt.target.files;
    var id = reactCaseBasedFileInputBinding.getId(evt.target);

    if (files.length === 0) {
      return;
    }

    $el.data(
      'currentUploader',
      new ReactFileUploader(
        Shiny.shinyapp,
        id,
        files,
        evt.target,
        appManager.caseBasedDataMgr.setFileUploadProgress,
        reactCaseBasedFileInputBinding
      )
    );
  };

  var reactCaseBasedFileInputBinding = new Shiny.InputBinding();
  $.extend(reactCaseBasedFileInputBinding, {
    find: function (scope) {
      return $(scope).find('#caseUploadBtn');
    },
    getId: function (el) {
      return Shiny.InputBinding.prototype.getId.call(this, el) || el.name;
    },
    getValue: function (el) {
      return $(el).value;
    },
    setValue: function () {
      // Not implemented
    },
    getType: function () {
      // This will be used only when restoring a file from a saved state.
      return 'shiny.file';
    },
    subscribe: function (el) {
      $(el).on('change.reactCaseBasedFileInputBinding', uploadCaseBasedFiles);
    },

    unsubscribe: function (el) {
      $(el).off('.reactCaseBasedFileInputBinding');
    }
  });

  function uploadAggrFiles(evt) {
    var $el = $(evt.target);
    abortCurrentUpload($el);

    var files = evt.target.files;
    var id = reactAggrFileInputBinding.getId(evt.target);

    if (files.length === 0) {
      return;
    }

    $el.data(
      'currentUploader',
      new ReactFileUploader(
        Shiny.shinyapp,
        id,
        files,
        evt.target,
        appManager.aggrDataMgr.setFileUploadProgress,
        reactAggrFileInputBinding
      )
    );
  };

  var reactAggrFileInputBinding = new Shiny.InputBinding();
  $.extend(reactAggrFileInputBinding, {
    find: function (scope) {
      return $(scope).find('#aggrUploadBtn');
    },
    getId: function (el) {
      return Shiny.InputBinding.prototype.getId.call(this, el) || el.name;
    },
    getValue: function (el) {
      return $(el).value;
    },
    setValue: function () {
      // Not implemented
    },
    getType: function () {
      // This will be used only when restoring a file from a saved state.
      return 'shiny.file';
    },
    subscribe: function (el) {
      $(el).on('change.reactAggrFileInputBinding', uploadAggrFiles);
    },

    unsubscribe: function (el) {
      $(el).off('.reactAggrFileInputBinding');
    }
  });

  Shiny.inputBindings.register(reactCaseBasedFileInputBinding, 'shiny.reactCaseBasedFileInputBinding');
  Shiny.inputBindings.register(reactAggrFileInputBinding, 'shiny.reactAggrFileInputBinding');
};

export default DefineReactFileInputBinding;
