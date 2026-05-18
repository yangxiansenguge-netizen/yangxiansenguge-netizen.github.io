import { ExamData } from '../../types';

export const javaBasicsData: ExamData = {
  source: "Java基础面试题库",
  ts: 1716000000000,
  items: [
    {
      id: 1,
      type: "简答",
      title: "JVM、JRE、JDK 区别与关系",
      options: [],
      correctAnswer: ["JVM：Java 虚拟机，运行 class 字节码，屏蔽系统差异，实现跨平台核心；JRE：Java 运行环境 = JVM + 基础类库，仅用于运行程序，无法开发；JDK：Java 开发工具包 = JRE + 编译调试等开发工具，开发必备。包含关系：JDK > JRE > JVM"],
      selectedAnswer: [],
      images: []
    },
    {
      id: 2,
      type: "简答",
      title: "Java 为什么跨平台？",
      options: [],
      correctAnswer: ["源码编译为统一 .class 字节码，不同操作系统安装对应 JVM，由 JVM 解析执行字节码，实现一次编译到处运行。"],
      selectedAnswer: [],
      images: []
    },
    {
      id: 3,
      type: "简答",
      title: "什么是字节码？",
      options: [],
      correctAnswer: ["javac 编译后生成的 class 文件指令码，不依赖硬件只面向 JVM，兼顾编译效率与跨平台特性。"],
      selectedAnswer: [],
      images: []
    },
    {
      id: 4,
      type: "简答",
      title: "Java 为什么是编译与解释并存？",
      options: [],
      correctAnswer: ["编译阶段：javac 把 java 源码编译为字节码；运行阶段：JVM 解释执行字节码。热点代码会被 JIT 即时编译为本地机器码，提升执行效率。"],
      selectedAnswer: [],
      images: []
    },
    {
      id: 5,
      type: "简答",
      title: "JIT 与 AOT 区别",
      options: [],
      correctAnswer: ["JIT：运行时动态编译，启动慢，运行效率高；AOT：提前预编译，启动速度快，不支持动态反射优化。"],
      selectedAnswer: [],
      images: []
    },
    {
      id: 6,
      type: "简答",
      title: "Java SE / EE / ME 区别",
      options: [],
      correctAnswer: ["SE：标准版，Java 基础核心语法；EE：企业版，用于后端项目、微服务开发；ME：微型版，老旧嵌入式设备，现已淘汰。"],
      selectedAnswer: [],
      images: []
    },
    {
      id: 7,
      type: "简答",
      title: "OpenJDK 和 OracleJDK 区别",
      options: [],
      correctAnswer: ["OpenJDK 开源免费；OracleJDK 商用高版本收费，基于 OpenJDK 二次开发，增加商用监控工具。"],
      selectedAnswer: [],
      images: []
    },
    {
      id: 8,
      type: "简答",
      title: "Java 八大基本数据类型及字节",
      options: [],
      correctAnswer: ["byte(1)、short(2)、int(4)、long(8)、float(4)、double(8)、char(2)、boolean(1字节)"],
      selectedAnswer: [],
      images: []
    },
    {
      id: 9,
      type: "简答",
      title: "基本类型与包装类型区别",
      options: [],
      correctAnswer: ["基本类型：存栈内存，无 null，有默认值，非对象，不能用于泛型；包装类型：引用类型，堆内存创建对象，默认值 null，支持泛型。比较：基本类型用==，包装类型推荐equals()"],
      selectedAnswer: [],
      images: []
    },
    {
      id: 10,
      type: "简答",
      title: "自动装箱与自动拆箱",
      options: [],
      correctAnswer: ["装箱：基本类型转包装类，底层调用 valueOf()；拆箱：包装类转基本类型，底层调用 xxxValue()"],
      selectedAnswer: [],
      images: []
    },
    {
      id: 11,
      type: "简答",
      title: "包装类缓存池机制",
      options: [],
      correctAnswer: ["Integer/Short/Long/Byte：缓存范围 -128~127；Character：缓存 0~127；Boolean 直接缓存两个静态对象；Float、Double 无缓存机制。缓存范围内复用对象，超出直接新建对象。"],
      selectedAnswer: [],
      images: []
    },
    {
      id: 12,
      type: "简答",
      title: "浮点运算精度丢失原因及解决",
      options: [],
      correctAnswer: ["十进制小数无法二进制精准存储，造成精度丢失；金融金额运算使用 BigDecimal。"],
      selectedAnswer: [],
      images: []
    },
    {
      id: 13,
      type: "简答",
      title: "超大数值如何处理？",
      options: [],
      correctAnswer: ["超出 long 范围整数用 BigInteger，高精度小数用 BigDecimal。"],
      selectedAnswer: [],
      images: []
    },
    {
      id: 14,
      type: "简答",
      title: "成员变量与局部变量区别",
      options: [],
      correctAnswer: ["位置：成员变量类中方法外，局部变量方法/代码块内；默认值：成员有默认值，局部无默认值必须手动赋值；内存：成员堆内存，局部栈内存；修饰符：成员可用权限修饰符、static，局部不可用；生命周期：成员随对象，局部方法执行结束销毁。"],
      selectedAnswer: [],
      images: []
    },
    {
      id: 15,
      type: "简答",
      title: "静态变量特点",
      options: [],
      correctAnswer: ["static 修饰，归属类不属于对象，所有对象共享一份，常用来定义全局常量。"],
      selectedAnswer: [],
      images: []
    },
    {
      id: 16,
      type: "简答",
      title: "重载与重写区别",
      options: [],
      correctAnswer: ["重载：同类中，方法名相同，参数列表不同，编译期绑定；重写：父子类继承，方法名参数完全一致，运行期动态绑定。"],
      selectedAnswer: [],
      images: []
    },
    {
      id: 17,
      type: "简答",
      title: "重写规则（两同两小一大）",
      options: [],
      correctAnswer: ["两同：方法名、参数列表相同；两小：返回值子类兼容、抛出异常范围更小；一大：子类访问权限大于等于父类。"],
      selectedAnswer: [],
      images: []
    },
    {
      id: 18,
      type: "简答",
      title: "哪些方法不能被重写？",
      options: [],
      correctAnswer: ["private、final、static 修饰方法都不能重写；static 方法可在子类同名再次声明（隐藏），不属于重写。"],
      selectedAnswer: [],
      images: []
    },
    {
      id: 19,
      type: "简答",
      title: "静态方法与实例方法区别",
      options: [],
      correctAnswer: ["静态方法归属类，类名直接调用，实例方法必须实例对象调用；静态只能访问静态成员，实例方法可访问所有成员；静态无多态，实例方法支持多态。"],
      selectedAnswer: [],
      images: []
    },
    {
      id: 20,
      type: "简答",
      title: "静态方法为什么不能访问非静态？",
      options: [],
      correctAnswer: ["静态随类加载优先存在，非静态成员依赖对象创建，静态执行时可能无对象，无法访问。"],
      selectedAnswer: [],
      images: []
    },
    {
      id: 21,
      type: "简答",
      title: "可变长参数特点",
      options: [],
      correctAnswer: ["格式：数据类型...参数名，本质数组，只能放在参数列表最后一位。"],
      selectedAnswer: [],
      images: []
    },
    {
      id: 22,
      type: "简答",
      title: "前置 ++ 与后置 ++ 区别",
      options: [],
      correctAnswer: ["前置先自增后运算；后置先运算后自增。"],
      selectedAnswer: [],
      images: []
    },
    {
      id: 23,
      type: "简答",
      title: "三种移位运算符",
      options: [],
      correctAnswer: ["<< 左移：低位补 0，等价乘 2；>> 带符号右移：高位补符号位，等价除 2；>>> 无符号右移：高位统一补 0。"],
      selectedAnswer: [],
      images: []
    },
    {
      id: 24,
      type: "简答",
      title: "break、continue、return 作用",
      options: [],
      correctAnswer: ["break：终止整个循环；continue：跳过本次循环，进入下一轮；return：直接结束当前方法。"],
      selectedAnswer: [],
      images: []
    },
    {
      id: 25,
      type: "简答",
      title: "Java 三种注释",
      options: [],
      correctAnswer: ["单行 //、多行 /* */、文档注释 /** */"],
      selectedAnswer: [],
      images: []
    },
    {
      id: 26,
      type: "简答",
      title: "关键字与标识符区别",
      options: [],
      correctAnswer: ["关键字是 Java 内置预留单词，有固定作用；标识符是程序员自定义命名（类、变量、方法名）。"],
      selectedAnswer: [],
      images: []
    },
    {
      id: 27,
      type: "简答",
      title: "true、false、null 是关键字吗？",
      options: [],
      correctAnswer: ["不是关键字，属于字面量，不能作为自定义标识符使用。"],
      selectedAnswer: [],
      images: []
    },
    {
      id: 28,
      type: "简答",
      title: "什么是实例化？",
      options: [],
      correctAnswer: ["通过 new 关键字根据类模板创建对象的过程，在堆内存开辟对象空间。"],
      selectedAnswer: [],
      images: []
    },
    {
      id: 29,
      type: "简答",
      title: "引用类型包含哪些？",
      options: [],
      correctAnswer: ["类、接口、数组、枚举，所有引用类型默认值均为 null。"],
      selectedAnswer: [],
      images: []
    },
    {
      id: 30,
      type: "简答",
      title: "父类引用指向子类对象特点",
      options: [],
      correctAnswer: ["非静态方法执行子类重写方法（多态）；静态方法只看左边引用类型，无多态效果。"],
      selectedAnswer: [],
      images: []
    }
  ]
};
