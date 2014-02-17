(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['projects_hb_template'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n	<div class=\"client_heading\"><h2 class=\"same_as_h1 brace_it\">";
  if (stack1 = helpers.client_heading) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.client_heading; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</h2></div>\r\n";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n	<div class=\"image_corners ratio_19_12 project_image\">\r\n		<div>\r\n			";
  if (stack1 = helpers.project_image_markup) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.project_image_markup; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n		</div>\r\n	</div>\r\n";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n	";
  if (stack1 = helpers.project_description) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.project_description; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n";
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n	<div class=\"center_inside client_link\"><a class=\"button\" href=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.link),stack1 == null || stack1 === false ? stack1 : stack1.href)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.link),stack1 == null || stack1 === false ? stack1 : stack1.text)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "<div class=\"left_glow\"></div><div class=\"right_glow\"></div></a></div>\r\n";
  return buffer;
  }

function program9(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\r\n	<div class=\"client_share_buttons\">";
  if (stack1 = helpers.share_content) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.share_content; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</div>\r\n";
  return buffer;
  }

  stack1 = helpers['if'].call(depth0, depth0.client_heading, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n\r\n";
  stack1 = helpers['if'].call(depth0, depth0.project_image_markup, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n\r\n";
  stack1 = helpers['if'].call(depth0, depth0.project_description, {hash:{},inverse:self.noop,fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n\r\n";
  stack1 = helpers['if'].call(depth0, depth0.link, {hash:{},inverse:self.noop,fn:self.program(7, program7, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n\r\n";
  stack1 = helpers['if'].call(depth0, depth0.share_content, {hash:{},inverse:self.noop,fn:self.program(9, program9, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\r\n";
  return buffer;
  });
})();