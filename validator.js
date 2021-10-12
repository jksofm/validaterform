
// 
function Validator(options) {


    // ////////////////////////////////////////
    function getParent(element,selector) {
        while(element.parentElement){
            if(element.parentElement.matches(selector)){
                return element.parentElement;

            }
            element = element.parentElement;
        }

        
    }
    // ////////////////////////////////////////////

    var  selectorRules = {

    }
    var formElement = document.querySelector(options.form)
    // //////////////////////////////////////////////
    function validate(inputElement,errorElement,rules,rule) {
    var errorMessage;
    //  lấy ra cac rule cua selector
    // Lặp qua từng rules và check
    // Nếu có lõi thì dừng việc kiểm tra
      // var errorMessage = rule.test(inputElement.value)
        for (var i = 0 ; i < rules.length ; i++) {
            switch(inputElement.type){
                case 'checkbox':
                case 'radio' :
                     errorMessage = rules[i](
                         formElement.querySelector(rule.selector + ':checked')
                     )
                    
                    

                    break;
                default:
            errorMessage = rules[i](inputElement.value);
                
            }
            if (errorMessage) break;
        }



        if(errorMessage) {
            
            errorElement.innerText = errorMessage;
            // inputElement.parentElement.classList.add('invalid')
            getParent(inputElement,options.formGroupSelector).classList.add('invalid')

          
        }
        else  {
            errorElement.innerText = '';
            // inputElement.parentElement.classList.remove('invalid')
            getParent(inputElement,options.formGroupSelector).classList.remove('invalid')

           

         

        }
        return errorMessage;
             
    }


    // //////////////////////////////////////////////

    
    
    if(formElement){


        
        // Khi submit form
                    formElement.onsubmit = function(e){
                        e.preventDefault();

                         var isFormValid = true;

                        // Lặp qua từng rule và validate
                        options.rules.forEach(function(rule){
                            
                            var inputElement = formElement.querySelector(rule.selector);
                    //  var errorElement  = inputElement.parentElement.querySelector(options.erroSelector);
                    var errorElement = getParent(inputElement,options.formGroupSelector).querySelector(options.erroSelector);
                    

                     if(Array.isArray(selectorRules[rule.selector])){
                        selectorRules[rule.selector].push(rule.test)
                    } else {
                        selectorRules[rule.selector]= [rule.test]
                    }
                    var rules = selectorRules[rule.selector]

                            var isValid =  validate(inputElement,errorElement,rules,rule);
                            if (isValid){
                                isFormValid = false;
                            }
                        });
                       
                        

                        if(isFormValid){
                            if(typeof options.onSubmit === 'function'){
                                var enableInputs = formElement.querySelectorAll("[name]:not([disabled])")
                                var formValues = Array.from(enableInputs).reduce(function(values,input){
                                    switch(input.type){
                                        case 'radio':
                                            values[input.name]=formElement.querySelector('input[name="' + input.name + '"]:checked').value;
                                            break;
                                        case 'checkbox':
                                              if(!input.matches(':checked')) return values
                                              if(!Array.isArray(values[input.name])){
                                                  values[input.name] = []

                                              }
                                              values[input.name].push(input.value)
                                        case 'file' :
                                           values[input.name] =input.files;
                                            break;

                                            
                                            break;

                                        default:
                                            values[input.name]= input.value
                                            
                                           

                                            

                                         

                                    }
                                      return  values;
                                },{});
                                options.onSubmit(formValues);

                               
                                
                            }

                        }else{
                            console.log("cólooix")
                        }
                    }

                    // ///////////////////////////////////////////////





        // Lặp qua từng thằng rules và thưc hiện action
         options.rules.forEach(function(rule){
            var inputElements = formElement.querySelectorAll(rule.selector);
            
            // lưu lại các rules for
            // selectorRules[rule.selector]=rule.test;
            if(Array.isArray(selectorRules[rule.selector])){
                selectorRules[rule.selector].push(rule.test)
            } else {
                selectorRules[rule.selector]= [rule.test]
            }
            var rules = selectorRules[rule.selector]
            Array.from(inputElements).forEach(function(inputElement){
                inputElement.onblur=function(){
                    //   Xủ lí tường hơp blur ra khoi input
                  
                    //  var errorElement  = inputElement.parentElement.querySelector(options.erroSelector);
                     var errorElement = getParent(inputElement,options.formGroupSelector).querySelector(options.erroSelector);
                     validate(inputElement,errorElement,rules,rule)

                     

                    
                              
                             
                 }
                 
                 inputElement.oninput = function(errorElement){
                    errorElement.innerText = '';
                    // inputElement.parentElement.classList.remove('invalid')
                    getParent(inputElement,options.formGroupSelector).classList.remove('invalid')
                 }
            })
            
         })
    }
}


// Định nghĩa rules
// Nguyên tăc rles :
// 1. khi có lõi => trả ra messega lỗi 
// 2. Khi hợp lệ => không trả ra cái j cả
Validator.isRequired = function(selector,message){
   return {
       selector: selector,
       test: function(value){
          return value ? undefined : message || "Vui lồng nhập trường này"
         
       }
   }
}

Validator.isEmail = function(selector,message){
    return {
        selector: selector,
        test: function(value){
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : message || "Trường này phải là email"
            
        }
    }
}

Validator.minLength = function(selector,min){
    return {
        selector: selector,
        test: function(value){
           
            return value.length >= min ? undefined : `Vui lòng tối thiểu nhập ${min}  kí thiệu`
            
        }
    }
}
Validator.isConfirmation = function (selector, getConfirmValue,message) {
    return{
        selector: selector,
        test : function (value){
            return value === getConfirmValue() ? undefined : message || "Giá trị nhập vào không chính xác"
        }
    }
}

